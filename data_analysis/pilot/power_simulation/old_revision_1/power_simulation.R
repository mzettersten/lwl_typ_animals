library(tidyverse)
library(janitor)
library(cowplot)
library(here)
library(lme4)
library(simr)
theme_set(theme_cowplot())

set.seed(1142021)
ms_per_frame=1000/30

#### prepare pilot data ####

#### get data
data_file_path <- here::here("..","data","CATegories_exp1_pilot_processed_data.csv")
d <- read_csv(data_file_path)

#### summarize useable trials ####
analysis_window=c(300,2800)

summarize_subj_useable_trials <- d %>%
  filter(corrected_time_centered>=analysis_window[1]&corrected_time_centered<=analysis_window[2]) %>%
  group_by(sub_num, months,age_mo, sex, trial_order,trial_number,target_image,target_typicality_z) %>%
  summarize(
    length_window=n(),
    useable_frames_window=sum(!is.na(accuracy_transformed)),
    percent_useable_window=useable_frames_window/length_window,
    useable_window=ifelse(percent_useable_window>=0.5,1,0), #useable if at least 50% looking
    mean_accuracy=mean(accuracy_transformed,na.rm=TRUE)
  )

#overall useable trials
summarize_useable_trials <- summarize_subj_useable_trials %>%
  group_by(sub_num, months, sex, trial_order) %>%
  summarize(
    num_useable_trials_window=sum(useable_window),
    exclude_participant=ifelse(num_useable_trials_window<8,1,0) # must contribute at least half of the total trials (n=16 in pilot)
  )

#join with main data frame
d <- d %>%
  left_join(summarize_subj_useable_trials) %>%
  left_join(summarize_useable_trials) 

## add general category properties from typicality dataset
## typicality
animal_rating_names <- read.csv(here::here("..","data","animal_ratings_stimuli_full.csv"))
animal_stims <- unique(c(unique(d$left_image),unique(d$right_image)))
typicality <- read.csv(here::here("..","data","typicality_animals_summarized.csv")) %>%
  mutate(item_name=str_remove(animal_name,pattern=" ")) %>%
  left_join(animal_rating_names) %>%
  filter(imageName %in% animal_stims)
d <- d %>%
  left_join(typicality %>% select(imageName,category,typicality_subjective),by=c("target_image" = "imageName")) %>%
  rename(typicality_condition=typicality_subjective)

#summarize subject-level accuracy
avg_accuracy_by_condition <- d %>%
  filter(exclude_participant==0) %>%
  filter(useable_window==1) %>%
  filter(corrected_time_centered>=300&corrected_time_centered<=2800) %>%
  group_by(sub_num, months,age_mo,age_group, sex, trial_order,trial_number,target_image,typicality_condition) %>%
  summarize(mean_accuracy=mean(accuracy_transformed,na.rm=TRUE)) %>%
  ungroup() %>%
  group_by(sub_num, age_mo,age_group, sex, trial_order,typicality_condition) %>%
  summarize(N=n(),
            accuracy=mean(mean_accuracy,na.rm=TRUE),
            ci=qt(0.975, N-1)*sd(mean_accuracy,na.rm=T)/sqrt(N),
            lower_ci=accuracy-ci,
            upper_ci=accuracy+ci) %>%
  mutate(typicality_condition_c = ifelse(typicality_condition=="typical",0.5,-0.5)) %>%
  ungroup() %>%
  mutate(
    age_mo_c = age_mo - mean(age_mo)
  )

## average accuracy by image
subj_accuracy_by_image <- d %>%
  filter(exclude_participant==0) %>%
  filter(useable_window==1) %>%
  filter(corrected_time_centered>=analysis_window[1]&corrected_time_centered<=analysis_window[2]) %>%
  group_by(sub_num, months,age_mo,age_group, sex, trial_order,target_image,category,typicality_condition) %>%
  summarize(
    N=n(),
    mean_accuracy=mean(accuracy_transformed,na.rm=TRUE)) %>%
  ungroup() 

## typicality effect by category and subject
subj_accuracy_by_category <- subj_accuracy_by_image %>%
  group_by(sub_num,months,age_mo,age_group, sex,trial_order,category,typicality_condition) %>%
  summarize(
    accuracy=mean(mean_accuracy)) %>%
  group_by(sub_num,months,age_mo,age_group, sex,trial_order,category) %>%
  summarize(
    typicality_difference=accuracy[typicality_condition=="typical"]-accuracy[typicality_condition=="atypical"]
  )


#### SIMULATION -Aim 2 ####
nsims=1000
sample_size=68

#### fit model and simulate power
fixed_effects_2 <- c(0.0125,0.025,0.05)
power_simulation_m2 <- data.frame()

### Aim 2 model 
m_2 <- lmer(accuracy~typicality_condition_c+age_mo_c+typicality_condition_c:age_mo_c+(1|sub_num),
          data=avg_accuracy_by_condition) 
# identical to model with by-subject typicality condition slope (ignoring the degree of freedom error), 
# but the model with slope causes an issue in fitting when simulating power, so therefore using this simplified (identical) version of the model
summary(m_2)

for (fxef in fixed_effects_2) {
  print(fxef)
  fixef(m_2)['typicality_condition_c:age_mo_c'] <- fxef
  summary(m_2)
  model_ext_subj_2_range <- extend(m_2, along="sub_num", n=sample_size)
  p <- powerSim(model_ext_subj_2_range,test=fixed('typicality_condition_c:age_mo_c',method='z'),nsim=nsims,progress=TRUE)
  power <- mean(p$pval<0.05)
  temp <- data.frame(model="2",fixed_effect=fxef,sample_size=sample_size,nsims=nsims,power=power)
  power_simulation_m2 <- bind_rows(power_simulation_m2,temp)
}

write.csv(power_simulation_m2,"power_simulation_m2.csv",row.names=F)


##### SIMULATION - Aim 3 #####

#### Typicality Only ####

#### general parameters

num_simulations <- 50 # refers to typicality simulations
nsims <- 100
sample_size <- 68

#data frame to store power results in
power_simulation <- data.frame()

for (i in 1:num_simulations) {
  print(i)

#### Step 1: simulate typicality dataset ####
#participants and images
list_participants <- unique(d$sub_num)
list_images <- unique(typicality$imageName)

sim_exp_typicality_data <- data.frame(
  #add participants
  sub_num=rep(list_participants,each=length(list_images))) %>%
  #add images
  mutate(imageName=rep(list_images,times=length(list_participants))) %>%
  left_join(typicality) %>%
  group_by(sub_num,imageName) %>%
  mutate(
    raw_simulated_rating=round(rnorm(1,mean=mean_typicality,sd=sd_typicality),0)
  ) %>%
  mutate(
    simulated_rating=case_when(
      raw_simulated_rating < 1 ~ 1,
      raw_simulated_rating > 5 ~ 5,
      TRUE ~ raw_simulated_rating
    )
  ) %>%
  group_by(sub_num) %>%
  mutate(simulated_rating_z=scale(simulated_rating)) %>%
  select(sub_num,imageName,category, typicality_subjective,simulated_rating,simulated_rating_z) %>%
  mutate(target_image=imageName) %>%
  select(sub_num,target_image,category,typicality_subjective,simulated_rating,simulated_rating_z)

sim_exp_typicality_by_category <- sim_exp_typicality_data %>%
  group_by(sub_num,category) %>%
  summarize(
    simulated_typicality_difference=mean(simulated_rating_z[typicality_subjective=="typical"])-mean(simulated_rating_z[typicality_subjective=="atypical"])
  ) 

## average accuracy by image
subj_accuracy_by_image <- d %>%
  filter(exclude_participant==0) %>%
  filter(useable_window==1) %>%
  filter(corrected_time_centered>=analysis_window[1]&corrected_time_centered<=analysis_window[2]) %>%
  group_by(sub_num, months,age_mo,age_group, sex, trial_order,target_image,category,typicality_condition) %>%
  summarize(
    N=n(),
    mean_accuracy=mean(accuracy_transformed,na.rm=TRUE)) %>%
  ungroup() 

## typicality effect by category and subject
subj_accuracy_by_category <- subj_accuracy_by_image %>%
  group_by(sub_num,months,age_mo,age_group, sex,trial_order,category,typicality_condition) %>%
  summarize(
    accuracy=mean(mean_accuracy)) %>%
  group_by(sub_num,months,age_mo,age_group, sex,trial_order,category) %>%
  summarize(
    typicality_difference=accuracy[typicality_condition=="typical"]-accuracy[typicality_condition=="atypical"]
  )

#join w/ image-wise accuracy
subj_accuracy_by_image <- subj_accuracy_by_image %>%
  left_join(sim_exp_typicality_data)

#join w/ category-wise accuracy
subj_accuracy_by_category <- subj_accuracy_by_category %>%
  left_join(sim_exp_typicality_by_category) %>%
  group_by(sub_num) %>%
  mutate(
    simulated_typicality_difference_c=simulated_typicality_difference-mean(simulated_typicality_difference,na.rm=T)
  )

##### STEP 2: FIT MODELS AND SIMULATE POWER ####


fixed_effects_3.1 <- c(0.05,0.075,0.1)

### Aim 3.1. model (experience only)
print(paste0("SIMULATION ", i,": AIM 3.1"))
m_3.1 <- lmer(
  typicality_difference ~ 1+simulated_typicality_difference_c+(1+simulated_typicality_difference_c|sub_num),
  data=subj_accuracy_by_category,
  control=lmerControl(check.conv.singular = "ignore"))
summary(m_3.1)

for (fxef in fixed_effects_3.1) {
  print(fxef)
  fixef(m_3.1)['simulated_typicality_difference_c'] <- fxef
  summary(m_3.1)
  model_ext_subj_3.1_range <- extend(m_3.1, along="sub_num", n=sample_size)
  p <- powerSim(model_ext_subj_3.1_range,test=fixed('simulated_typicality_difference_c'),nsim=nsims,progress=FALSE)
  power <- mean(p$pval<0.05)
  #powerCurve(model_ext_subj_3.1_range,test=fixed('simulated_typicality_difference_c'), along="sub_num",breaks=seq(15,90,15),nsim=nsims)
  temp <- data.frame(simulation_num=i,model="3.1",fixed_effect=fxef,sample_size=sample_size,nsims=nsims,power=power)
  power_simulation <- bind_rows(power_simulation,temp)
}

### Aim 3.2. model (experience only)
print(paste0("SIMULATION ", i,": AIM 3.2"))
m_3.2 <- lmer(
  mean_accuracy ~ 1+simulated_rating_z+(1+simulated_rating_z|sub_num)+(1+simulated_rating_z|target_image),
  data=subj_accuracy_by_image,
  control=lmerControl(check.conv.singular = "ignore"))
summary(m_3.2)

fixed_effects_3.2 <- c(0.025,0.05)


for (fxef in fixed_effects_3.2) {
  print(fxef)
  fixef(m_3.2)['simulated_rating_z'] <- fxef
  #summary(m_3.2)
  model_ext_subj_3.2_range <- extend(m_3.2, along="sub_num", n=sample_size)
  p <- powerSim(model_ext_subj_3.2_range,test=fixed("simulated_rating_z"),nsim=nsims,progress=FALSE)
  power <- mean(p$pval<0.05)
  #powerCurve(model_ext_subj_3.2_range,test=fixed("simulated_rating_z"), along="sub_num",breaks=seq(15,90,15),nsim=nsims)
  temp <- data.frame(simulation_num=i,model="3.2",fixed_effect=fxef,sample_size=sample_size,nsims=nsims,power=power)
  power_simulation <- bind_rows(power_simulation,temp)
}

}

write.csv(power_simulation,"power_simulation_m3.csv",row.names=F)

#summarize
power_simulation %>%
  group_by(model,fixed_effect) %>%
  summarize(
    N=n(),
    mean_power=mean(power),
    sd_power=sd(power)
  )

#### With Age ####

#### general parameters

num_simulations <- 50 # refers to typicality simulations
nsims <- 100
sample_size <- 68

#data frame to store power results in
power_simulation <- data.frame()

for (i in 1:num_simulations) {
  print(i)
  
  #### Step 1: simulate typicality dataset ####
  #participants and images
  list_participants <- unique(d$sub_num)
  list_images <- unique(typicality$imageName)
  
  sim_exp_typicality_data <- data.frame(
    #add participants
    sub_num=rep(list_participants,each=length(list_images))) %>%
    #add images
    mutate(imageName=rep(list_images,times=length(list_participants))) %>%
    left_join(typicality) %>%
    group_by(sub_num,imageName) %>%
    mutate(
      raw_simulated_rating=round(rnorm(1,mean=mean_typicality,sd=sd_typicality),0)
    ) %>%
    mutate(
      simulated_rating=case_when(
        raw_simulated_rating < 1 ~ 1,
        raw_simulated_rating > 5 ~ 5,
        TRUE ~ raw_simulated_rating
      )
    ) %>%
    group_by(sub_num) %>%
    mutate(simulated_rating_z=scale(simulated_rating)) %>%
    select(sub_num,imageName,category, typicality_subjective,simulated_rating,simulated_rating_z) %>%
    mutate(target_image=imageName) %>%
    select(sub_num,target_image,category,typicality_subjective,simulated_rating,simulated_rating_z)
  
  sim_exp_typicality_by_category <- sim_exp_typicality_data %>%
    group_by(sub_num,category) %>%
    summarize(
      simulated_typicality_difference=mean(simulated_rating_z[typicality_subjective=="typical"])-mean(simulated_rating_z[typicality_subjective=="atypical"])
    ) 
  
  ## average accuracy by image
  subj_accuracy_by_image <- d %>%
    filter(exclude_participant==0) %>%
    filter(useable_window==1) %>%
    filter(corrected_time_centered>=analysis_window[1]&corrected_time_centered<=analysis_window[2]) %>%
    group_by(sub_num, months,age_mo,age_group, sex, trial_order,target_image,category,typicality_condition) %>%
    summarize(
      N=n(),
      mean_accuracy=mean(accuracy_transformed,na.rm=TRUE)) %>%
    ungroup() 
  
  ## typicality effect by category and subject
  subj_accuracy_by_category <- subj_accuracy_by_image %>%
    group_by(sub_num,months,age_mo,age_group, sex,trial_order,category,typicality_condition) %>%
    summarize(
      accuracy=mean(mean_accuracy)) %>%
    group_by(sub_num,months,age_mo,age_group, sex,trial_order,category) %>%
    summarize(
      typicality_difference=accuracy[typicality_condition=="typical"]-accuracy[typicality_condition=="atypical"]
    )
  
  #join w/ image-wise accuracy
  subj_accuracy_by_image <- subj_accuracy_by_image %>%
    left_join(sim_exp_typicality_data) %>%
    ungroup() %>%
    mutate(
      age_mo_c = age_mo - mean(age_mo)
    )
  
  #join w/ category-wise accuracy
  subj_accuracy_by_category <- subj_accuracy_by_category %>%
    left_join(sim_exp_typicality_by_category) %>%
    group_by(sub_num) %>%
    mutate(
      simulated_typicality_difference_c=simulated_typicality_difference-mean(simulated_typicality_difference,na.rm=T)
    ) %>%
    ungroup() %>%
    mutate(
      age_mo_c = age_mo - mean(age_mo)
    )
  
  
  ##### STEP 2: FIT MODELS AND SIMULATE POWER ####
  
  
  fixed_effects_3.1 <- c(0.05,0.075,0.1)
  
  ### Aim 3.1. model (w/ age)
  print(paste0("SIMULATION ", i,": AIM 3.1"))
  m_3.1 <- lmer(
    typicality_difference ~ 1+simulated_typicality_difference_c+age_mo_c+(1+simulated_typicality_difference_c|sub_num),
    data=subj_accuracy_by_category,
    control=lmerControl(check.conv.singular = "ignore"))
  summary(m_3.1)
  
  for (fxef in fixed_effects_3.1) {
    print(fxef)
    fixef(m_3.1)['simulated_typicality_difference_c'] <- fxef
    summary(m_3.1)
    model_ext_subj_3.1_range <- extend(m_3.1, along="sub_num", n=sample_size)
    p <- powerSim(model_ext_subj_3.1_range,test=fixed('simulated_typicality_difference_c'),nsim=nsims,progress=FALSE)
    power <- mean(p$pval<0.05)
    #powerCurve(model_ext_subj_3.1_range,test=fixed('simulated_typicality_difference_c'), along="sub_num",breaks=seq(15,90,15),nsim=nsims)
    temp <- data.frame(simulation_num=i,model="3.1",fixed_effect=fxef,sample_size=sample_size,nsims=nsims,power=power)
    power_simulation <- bind_rows(power_simulation,temp)
  }
  
  ### Aim 3.2. model (w/age)
  print(paste0("SIMULATION ", i,": AIM 3.2"))
  m_3.2 <- lmer(
    mean_accuracy ~ 1+simulated_rating_z+age_mo_c+(1+simulated_rating_z|sub_num)+(1+simulated_rating_z|target_image),
    data=subj_accuracy_by_image,
    control=lmerControl(check.conv.singular = "ignore"))
  summary(m_3.2)
  
  fixed_effects_3.2 <- c(0.025,0.05)
  
  
  for (fxef in fixed_effects_3.2) {
    print(fxef)
    fixef(m_3.2)['simulated_rating_z'] <- fxef
    #summary(m_3.2)
    model_ext_subj_3.2_range <- extend(m_3.2, along="sub_num", n=sample_size)
    p <- powerSim(model_ext_subj_3.2_range,test=fixed("simulated_rating_z"),nsim=nsims,progress=FALSE)
    power <- mean(p$pval<0.05)
    #powerCurve(model_ext_subj_3.2_range,test=fixed("simulated_rating_z"), along="sub_num",breaks=seq(15,90,15),nsim=nsims)
    temp <- data.frame(simulation_num=i,model="3.2",fixed_effect=fxef,sample_size=sample_size,nsims=nsims,power=power)
    power_simulation <- bind_rows(power_simulation,temp)
  }
  
}

write.csv(power_simulation,"power_simulation_m3_age.csv",row.names=F)

#summarize
power_simulation %>%
  group_by(model,fixed_effect) %>%
  summarize(
    N=n(),
    mean_power=mean(power),
    sd_power=sd(power)
  )
