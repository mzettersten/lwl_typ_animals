library(tidyverse)
library(janitor)
library(cowplot)
library(here)
library(lme4)
library(simr)
library(tictoc)
theme_set(theme_cowplot())

set.seed(12252021)
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

## FUTURE ANALYSES: also exclude trials if insufficient looking during the baseline window (see 1_analysis.Rmd)

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

#summarize trial-level accuracy
#critical window
avg_trials <- d %>%
  filter(exclude_participant==0) %>%
  filter(useable_window==1) %>%
  filter(corrected_time_centered>=300&corrected_time_centered<=2800) %>%
  group_by(sub_num, months,age_mo,age_group, sex, trial_order,trial_number,target_image,category,typicality_condition,target_typicality_z) %>%
  summarize(mean_accuracy=mean(accuracy_transformed,na.rm=TRUE)) %>%
  ungroup() %>%
  mutate(typicality_condition_c = ifelse(typicality_condition=="typical",0.5,-0.5)) %>%
  ungroup() %>%
  mutate(
    age_mo_c = age_mo - mean(age_mo),
    offset.5=0.5
  )
#baseline window
avg_trial_baseline <- d %>%
  filter(exclude_participant==0) %>%
  filter(useable_window==1) %>%
  filter(corrected_time_centered>=-2000 & corrected_time_centered<=0) %>%
  group_by(sub_num, months,age_mo,age_group, sex, trial_order,trial_number,target_image,category,typicality_condition,target_typicality_z) %>%
  summarize(mean_baseline=mean(accuracy_transformed,na.rm=TRUE)) %>%
  ungroup() %>%
  mutate(typicality_condition_c = ifelse(typicality_condition=="typical",0.5,-0.5)) %>%
  ungroup() %>%
  mutate(
    age_mo_c = age_mo - mean(age_mo),
    offset.5=0.5
  )

#join and compute baseline-corrected proportion target looking
avg_trials <- avg_trials %>%
  left_join(avg_trial_baseline) %>%
  mutate(accuracy_baseline=mean_accuracy-mean_baseline)

#### MAIN MODELS W/ TARGET WORD RANDOM INTERCEPT ####

#### SIMULATION -Aim 1 ####
nsims=1000
#sample_size=68
sample_sizes <- c(40, 60, 68, 70, 80, 100)

#### fit model and simulate power
fixed_effects_1 <- c(0.025,0.05,0.06,0.075,0.08, 0.1)
power_simulation_m1 <- data.frame()

### Aim 1 model 
m_1 <- lmer(accuracy_baseline ~ typicality_condition_c+(1+typicality_condition_c|sub_num)+(1|category),data=filter(avg_trials,age_group=="older than 14 months"))
summary(m_1)
tic()
for (sample_size in sample_sizes) {
  for (fxef in fixed_effects_1) {
    print(fxef)
    fixef(m_1)['typicality_condition_c'] <- fxef
    summary(m_1)
    model_ext_subj_1_range <- extend(m_1, along="sub_num", n=sample_size)
    p <- powerSim(model_ext_subj_1_range,test=fixed('typicality_condition_c',method='z'),nsim=nsims,progress=TRUE)
    power <- mean(p$pval<0.05)
    temp <- data.frame(model="1",fixed_effect=fxef,sample_size=sample_size,nsims=nsims,power=power)
    power_simulation_m1 <- bind_rows(power_simulation_m1,temp)
  }
}
toc()
write.csv(power_simulation_m1,here::here("results","power_simulation_m1.csv"),row.names=F)

#### SIMULATION -Aim 2 ####
nsims=1000
#sample_size=68

#### fit model and simulate power
fixed_effects_2 <- c(0.0125,0.025,0.03,0.04,0.05)
power_simulation_m2 <- data.frame()

avg_trials_older <- filter(avg_trials,age_group=="older than 14 months") %>%
  mutate(age_mo_c=age_mo - mean(age_mo))

### Aim 2 model 
m_2 <- lmer(accuracy_baseline ~ typicality_condition_c+age_mo_c+typicality_condition_c:age_mo_c+(1+typicality_condition_c|sub_num)+(1|category),data=avg_trials_older)
summary(m_2)
tic()
for (sample_size in sample_sizes) {
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
}
toc()
write.csv(power_simulation_m2,here::here("results","power_simulation_m2.csv"),row.names=F)

#### MODELS W/ TARGET WORD BY TARGET IMAGE RANDOM INTERCEPT  ####

#### SIMULATION -Aim 1 ####
nsims=1000
#sample_size=68
sample_sizes <- c(40, 60, 68, 70, 80, 100)

#### fit model and simulate power
fixed_effects_1 <- c(0.025,0.05,0.06,0.075,0.08, 0.1)
power_simulation_m1 <- data.frame()

### Aim 1 model 
m_1 <- lmer(accuracy_baseline ~ typicality_condition_c+(1+typicality_condition_c|sub_num)+(1|category/target_image),data=filter(avg_trials,age_group=="older than 14 months"))
summary(m_1)
tic()
for (sample_size in sample_sizes) {
  for (fxef in fixed_effects_1) {
    print(fxef)
    fixef(m_1)['typicality_condition_c'] <- fxef
    summary(m_1)
    model_ext_subj_1_range <- extend(m_1, along="sub_num", n=sample_size)
    p <- powerSim(model_ext_subj_1_range,test=fixed('typicality_condition_c',method='z'),nsim=nsims,progress=TRUE)
    power <- mean(p$pval<0.05)
    temp <- data.frame(model="1",fixed_effect=fxef,sample_size=sample_size,nsims=nsims,power=power)
    power_simulation_m1 <- bind_rows(power_simulation_m1,temp)
  }
}
toc()
write.csv(power_simulation_m1,here::here("results","power_simulation_m1_category_by_target_image.csv"),row.names=F)

#### SIMULATION -Aim 2 ####
nsims=1000
#sample_size=68

#### fit model and simulate power
fixed_effects_2 <- c(0.0125,0.025,0.03,0.04,0.05)
power_simulation_m2 <- data.frame()

avg_trials_older <- filter(avg_trials,age_group=="older than 14 months") %>%
  mutate(age_mo_c=age_mo - mean(age_mo))

### Aim 2 model 
m_2 <- lmer(accuracy_baseline ~ typicality_condition_c+age_mo_c+typicality_condition_c:age_mo_c+(1+typicality_condition_c|sub_num)+(1|category/target_image),data=avg_trials_older)
summary(m_2)
tic()
for (sample_size in sample_sizes) {
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
}
toc()
write.csv(power_simulation_m2,here::here("results","power_simulation_m2_category_by_target_image.csv"),row.names=F)

#### MODELS W/ TARGET WORD RANDOM INTERCEPT AND TYPICALITY RANDOM SLOPE ####

#### SIMULATION -Aim 1 ####
nsims=1000
#sample_size=68
sample_sizes <- c(40, 60, 68, 70, 80, 100)

#### fit model and simulate power
fixed_effects_1 <- c(0.025,0.05,0.06,0.075,0.08, 0.1)
power_simulation_m1 <- data.frame()

### Aim 1 model 
m_1 <- lmer(accuracy_baseline ~ typicality_condition_c+(1+typicality_condition_c|sub_num)+(1+typicality_condition_c|category),data=filter(avg_trials,age_group=="older than 14 months"))
summary(m_1)
tic()
for (sample_size in sample_sizes) {
  for (fxef in fixed_effects_1) {
    print(fxef)
    fixef(m_1)['typicality_condition_c'] <- fxef
    summary(m_1)
    model_ext_subj_1_range <- extend(m_1, along="sub_num", n=sample_size)
    p <- powerSim(model_ext_subj_1_range,test=fixed('typicality_condition_c',method='z'),nsim=nsims,progress=TRUE)
    power <- mean(p$pval<0.05)
    temp <- data.frame(model="1",fixed_effect=fxef,sample_size=sample_size,nsims=nsims,power=power)
    power_simulation_m1 <- bind_rows(power_simulation_m1,temp)
  }
}
toc()
write.csv(power_simulation_m1,here::here("results","power_simulation_m1_category_slope.csv"),row.names=F)

#### SIMULATION -Aim 2 ####
nsims=1000
#sample_size=68

#### fit model and simulate power
fixed_effects_2 <- c(0.0125,0.025,0.03,0.04,0.05)
power_simulation_m2 <- data.frame()

avg_trials_older <- filter(avg_trials,age_group=="older than 14 months") %>%
  mutate(age_mo_c=age_mo - mean(age_mo))

### Aim 2 model 
m_2 <- lmer(accuracy_baseline ~ typicality_condition_c+age_mo_c+typicality_condition_c:age_mo_c+(1+typicality_condition_c|sub_num)+(1+typicality_condition_c|category),data=avg_trials_older)
summary(m_2)
tic()
for (sample_size in sample_sizes) {
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
}
toc()
write.csv(power_simulation_m2,here::here("results","power_simulation_m2_category_slope.csv"),row.names=F)

#### MODELS W/ TARGET WORD AND TARGET IMAGE RANDOM INTERCEPT, TYPICALITY RANDOM SLOPE ####

#### SIMULATION -Aim 1 ####
nsims=1000
#sample_size=68
sample_sizes <- c(40, 60, 68, 70, 80, 100)

#### fit model and simulate power
fixed_effects_1 <- c(0.025,0.05,0.06,0.075,0.08, 0.1)
power_simulation_m1 <- data.frame()

### Aim 1 model 
m_1 <- lmer(accuracy_baseline ~ typicality_condition_c+(1+typicality_condition_c|sub_num)+(1+typicality_condition_c|category)+(1|target_image),data=filter(avg_trials,age_group=="older than 14 months"))
summary(m_1)
tic()
for (sample_size in sample_sizes) {
  for (fxef in fixed_effects_1) {
    print(fxef)
    fixef(m_1)['typicality_condition_c'] <- fxef
    summary(m_1)
    model_ext_subj_1_range <- extend(m_1, along="sub_num", n=sample_size)
    p <- powerSim(model_ext_subj_1_range,test=fixed('typicality_condition_c',method='z'),nsim=nsims,progress=TRUE)
    power <- mean(p$pval<0.05)
    temp <- data.frame(model="1",fixed_effect=fxef,sample_size=sample_size,nsims=nsims,power=power)
    power_simulation_m1 <- bind_rows(power_simulation_m1,temp)
  }
}
toc()
write.csv(power_simulation_m1,here::here("results","power_simulation_m1_category_by_target_image_slope.csv"),row.names=F)

#### SIMULATION -Aim 2 ####
nsims=1000
#sample_size=68

#### fit model and simulate power
fixed_effects_2 <- c(0.0125,0.025,0.03,0.04,0.05)
power_simulation_m2 <- data.frame()

avg_trials_older <- filter(avg_trials,age_group=="older than 14 months") %>%
  mutate(age_mo_c=age_mo - mean(age_mo))

### Aim 2 model 
m_2 <- lmer(accuracy_baseline ~ typicality_condition_c+age_mo_c+typicality_condition_c:age_mo_c+(1+typicality_condition_c|sub_num)+(1+typicality_condition_c|category)+(1|target_image),data=avg_trials_older)
summary(m_2)
tic()
for (sample_size in sample_sizes) {
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
}
toc()
write.csv(power_simulation_m2,here::here("results","power_simulation_m2_category_by_target_image_slope.csv"),row.names=F)

#### MODELS W/ BY-PARTICIPANT RANDOM EFFECTS ONLY (NO BY-ITEM RANDOM EFFECTS) ####

#### SIMULATION -Aim 1 ####
set.seed(10282021)
nsims=1000
#sample_size=68
sample_sizes <- c(40, 60, 68, 70, 80, 100)

#### fit model and simulate power
fixed_effects_1 <- c(0.025,0.05,0.06,0.075,0.08, 0.1)
power_simulation_m1 <- data.frame()

### Aim 1 model 
m_1 <- lmer(accuracy_baseline ~ typicality_condition_c+(1+typicality_condition_c|sub_num),data=filter(avg_trials,age_group=="older than 14 months"))
summary(m_1)
tic()
for (sample_size in sample_sizes) {
  for (fxef in fixed_effects_1) {
    print(fxef)
    fixef(m_1)['typicality_condition_c'] <- fxef
    summary(m_1)
    model_ext_subj_1_range <- extend(m_1, along="sub_num", n=sample_size)
    p <- powerSim(model_ext_subj_1_range,test=fixed('typicality_condition_c',method='z'),nsim=nsims,progress=TRUE)
    power <- mean(p$pval<0.05)
    temp <- data.frame(model="1",fixed_effect=fxef,sample_size=sample_size,nsims=nsims,power=power)
    power_simulation_m1 <- bind_rows(power_simulation_m1,temp)
  }
}
toc()
write.csv(power_simulation_m1,here::here("results","power_simulation_m1_no_item_RE.csv"),row.names=F)

#### SIMULATION -Aim 2 ####
nsims=1000
#sample_size=68

#### fit model and simulate power
fixed_effects_2 <- c(0.0125,0.025,0.03,0.04,0.05)
power_simulation_m2 <- data.frame()

avg_trials_older <- filter(avg_trials,age_group=="older than 14 months") %>%
  mutate(age_mo_c=age_mo - mean(age_mo))

### Aim 2 model 
m_2 <- lmer(accuracy_baseline ~ typicality_condition_c+age_mo_c+typicality_condition_c:age_mo_c+(1+typicality_condition_c|sub_num),data=avg_trials_older)
summary(m_2)
tic()
for (sample_size in sample_sizes) {
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
}
toc()
write.csv(power_simulation_m2,here::here("results","power_simulation_m2_no_item_RE.csv"),row.names=F)

#### MAIN AIM 3 MODEL W/ TARGET WORD RANDOM INTERCEPT ####

##### SIMULATION - Aim 3 #####

#### general parameters

num_simulations <- 50 # refers to typicality simulations
nsims <- 100
sample_size <- 80

#data frame to store power results in
power_simulation <- data.frame()
power_simulation_age <- data.frame()

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

  
  
  
  #join w/ trial-level accur
  avg_trials <- avg_trials %>%
    left_join(sim_exp_typicality_data)
  
  avg_trials_older <- filter(avg_trials,age_group=="older than 14 months") %>%
    mutate(age_mo_c=age_mo - mean(age_mo))
  
  ##### STEP 2: FIT MODELS AND SIMULATE POWER ####

  
  ### Aim 3.2. model (experience only)
  print(paste0("SIMULATION ", i,": AIM 3.2"))
  m_3.2 <- lmer(
    accuracy_baseline ~ 1+simulated_rating_z+(1+simulated_rating_z|sub_num)+(1|category),
    data=filter(avg_trials,age_group=="older than 14 months"),
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
  
  ### Aim 3.2. model (w/age)
  print(paste0("SIMULATION ", i,": AIM 3.2 Age"))
  m_3.2_age <- lmer(
    accuracy_baseline ~ 1+simulated_rating_z+age_mo_c+(1+simulated_rating_z|sub_num)+(1|category),
    data=avg_trials_older,
    control=lmerControl(check.conv.singular = "ignore"))
  summary(m_3.2_age)
  
  
  
  for (fxef in fixed_effects_3.2) {
    print(fxef)
    fixef(m_3.2_age)['simulated_rating_z'] <- fxef
    model_ext_subj_3.2_range_age <- extend(m_3.2_age, along="sub_num", n=sample_size)
    p_age <- powerSim(model_ext_subj_3.2_range_age,test=fixed("simulated_rating_z"),nsim=nsims,progress=FALSE)
    power_age <- mean(p_age$pval<0.05)
    temp <- data.frame(simulation_num=i,model="3.2_age",fixed_effect=fxef,sample_size=sample_size,nsims=nsims,power=power_age)
    power_simulation_age <- bind_rows(power_simulation_age,temp)
  }
  
}

write.csv(power_simulation,here::here("results","power_simulation_m3.csv"),row.names=F)
write.csv(power_simulation_age,here::here("results","power_simulation_m3_age.csv"),row.names=F)

#summarize
power_simulation %>%
  group_by(model,fixed_effect) %>%
  summarize(
    N=n(),
    mean_power=mean(power),
    sd_power=sd(power)
  )

power_simulation_age %>%
  group_by(model,fixed_effect) %>%
  summarize(
    N=n(),
    mean_power=mean(power),
    sd_power=sd(power)
  )

#### AIM 3 MODEL W/ TARGET WORD BY TARGET IMAGE RANDOM INTERCEPT ####

##### SIMULATION - Aim 3 #####

#### general parameters
set.seed(10282021)
num_simulations <- 50 # refers to typicality simulations
nsims <- 100
sample_size <- 80

#data frame to store power results in
power_simulation <- data.frame()
power_simulation_age <- data.frame()

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
  
  
  
  
  #join w/ trial-level accur
  avg_trials <- avg_trials %>%
    left_join(sim_exp_typicality_data)
  
  avg_trials_older <- filter(avg_trials,age_group=="older than 14 months") %>%
    mutate(age_mo_c=age_mo - mean(age_mo))
  
  ##### STEP 2: FIT MODELS AND SIMULATE POWER ####
  
  
  ### Aim 3.2. model (experience only)
  print(paste0("SIMULATION ", i,": AIM 3.2"))
  m_3.2 <- lmer(
    accuracy_baseline ~ 1+simulated_rating_z+(1+simulated_rating_z|sub_num)+(1|category)+(1|target_image),
    data=filter(avg_trials,age_group=="older than 14 months"),
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
  
  ### Aim 3.2. model (w/age)
  print(paste0("SIMULATION ", i,": AIM 3.2 Age"))
  m_3.2_age <- lmer(
    accuracy_baseline ~ 1+simulated_rating_z+age_mo_c+(1+simulated_rating_z|sub_num)+(1|category)+(1|target_image),
    data=avg_trials_older,
    control=lmerControl(check.conv.singular = "ignore"))
  summary(m_3.2_age)
  
  
  
  for (fxef in fixed_effects_3.2) {
    print(fxef)
    fixef(m_3.2_age)['simulated_rating_z'] <- fxef
    model_ext_subj_3.2_range_age <- extend(m_3.2_age, along="sub_num", n=sample_size)
    p_age <- powerSim(model_ext_subj_3.2_range_age,test=fixed("simulated_rating_z"),nsim=nsims,progress=FALSE)
    power_age <- mean(p_age$pval<0.05)
    temp <- data.frame(simulation_num=i,model="3.2_age",fixed_effect=fxef,sample_size=sample_size,nsims=nsims,power=power_age)
    power_simulation_age <- bind_rows(power_simulation_age,temp)
  }
  
}

write.csv(power_simulation,here::here("results","power_simulation_m3_target_image.csv"),row.names=F)
write.csv(power_simulation_age,here::here("results","power_simulation_m3_age_target_image.csv"),row.names=F)

#### AIM 3 MODEL W/ TARGET WORD AND TARGET IMAGE RANDOM INTERCEPT, TYPICALITY RANDOM SLOPE  ####

##### SIMULATION - Aim 3 #####

#### general parameters
set.seed(10282021)
num_simulations <- 50 # refers to typicality simulations
nsims <- 100
sample_size <- 80

#data frame to store power results in
power_simulation <- data.frame()
power_simulation_age <- data.frame()

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
  
  
  
  
  #join w/ trial-level accur
  avg_trials <- avg_trials %>%
    left_join(sim_exp_typicality_data)
  
  avg_trials_older <- filter(avg_trials,age_group=="older than 14 months") %>%
    mutate(age_mo_c=age_mo - mean(age_mo))
  
  ##### STEP 2: FIT MODELS AND SIMULATE POWER ####
  
  
  ### Aim 3.2. model (experience only)
  print(paste0("SIMULATION ", i,": AIM 3.2"))
  m_3.2 <- lmer(
    accuracy_baseline ~ 1+simulated_rating_z+(1+simulated_rating_z|sub_num)+(1+simulated_rating_z|category)+(1|target_image),
    data=filter(avg_trials,age_group=="older than 14 months"),
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
  
  ### Aim 3.2. model (w/age)
  print(paste0("SIMULATION ", i,": AIM 3.2 Age"))
  m_3.2_age <- lmer(
    accuracy_baseline ~ 1+simulated_rating_z+age_mo_c+(1+simulated_rating_z|sub_num)+(1+simulated_rating_z|category)+(1|target_image),
    data=avg_trials_older,
    control=lmerControl(check.conv.singular = "ignore"))
  summary(m_3.2_age)
  
  
  
  for (fxef in fixed_effects_3.2) {
    print(fxef)
    fixef(m_3.2_age)['simulated_rating_z'] <- fxef
    model_ext_subj_3.2_range_age <- extend(m_3.2_age, along="sub_num", n=sample_size)
    p_age <- powerSim(model_ext_subj_3.2_range_age,test=fixed("simulated_rating_z"),nsim=nsims,progress=FALSE)
    power_age <- mean(p_age$pval<0.05)
    temp <- data.frame(simulation_num=i,model="3.2_age",fixed_effect=fxef,sample_size=sample_size,nsims=nsims,power=power_age)
    power_simulation_age <- bind_rows(power_simulation_age,temp)
  }
  
}

write.csv(power_simulation,here::here("results","power_simulation_m3_category_by_target_image_slope.csv"),row.names=F)
write.csv(power_simulation_age,here::here("results","power_simulation_m3_age_category_by_target_image_slope.csv"),row.names=F)
