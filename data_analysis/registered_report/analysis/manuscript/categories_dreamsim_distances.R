library(tidyverse)
library(here)
library(fs)
library(jsonlite)
library(ggimage)
library(harrietr) #need to have ggtree installed too, download from github if necessary
#devtools::install_github("YuLab-SMU/ggtree")
library(dendextend)

#### HELPER FUNCTIONS ####

#### function for computing distance matrix
get_distance <- function(current_d,normalize_dist=T) {
  
  current_d <- current_d %>%
    tibble::column_to_rownames(var = "image_name_level")
  
  d_dist <- current_d %>%
    dplyr::select(x,y) %>%
    as.matrix() %>%
    dist(diag=T,upper=T)
  
  if (normalize_dist) {
    d_dist <- d_dist/(max(d_dist))
  }
  
  d_dist
}

#### convert long data to dist object ####
long_to_dist <- function(d_long, colnames=c("item1","item2"),dist_name="avg_dist") {
  #add zero distance columns (to avoid some problems when converting to a matrix)
  zero_distance_d <- data.frame(
    col1 = unique(c(pull(d_long[colnames[1]]),pull(d_long[colnames[2]]))),
    col2 = unique(c(pull(d_long[colnames[1]]),pull(d_long[colnames[2]]))), 
    col3 = 0)
  
  colnames(zero_distance_d) <- c(colnames,dist_name)
  
  #add zero distance columns to long data frame
  d_long <- bind_rows(d_long,zero_distance_d)
  
  #convert long data to wide
  dist_wide <- d_long %>%
    select(c(colnames,all_of(dist_name))) %>%
    spread(colnames[1], dist_name) %>%
    #add rownames
    column_to_rownames("item2")
  
  #convert to matrix and then to dist object
  dist <- as.matrix(dist_wide) %>%
    as.dist()
  
  dist
}

# function for creating hierarchical cluster
clean_cluster <- function(d,cur_method="ward.D2") {
  cur_cluster <- d %>%
    hclust(method = cur_method)
  cur_cluster
}

#### LOAD DATA ####
## set paths and load data
typicality_data_path <- here("..","..","data","processed_data","typicality_animals_summarized.csv")
dream_data_path <- here("..","..","data","processed_data","categories_dreamsim_image_pairwise_distances.csv")

dream_distances <- read_csv(dream_data_path) %>%
  mutate(
    image1=tools::file_path_sans_ext(path_file(image_1)),
    image2=tools::file_path_sans_ext(path_file(image_2)),
    item1=str_remove(image1,"_600x600"),
    item2=str_remove(image2,"_600x600")
  ) %>%
  rename(
    dream_distance=distance
  )

typicality_data <- read_csv(typicality_data_path) %>%
  select(final_image_name,mean_typicality,category, typicality_subjective)

all_distance_data <- dream_distances %>%
  left_join(typicality_data, by=c("item1"="final_image_name")) %>%
  rename(mean_typicality1=mean_typicality,
         category1=category,
         typicality1=typicality_subjective) %>%
  left_join(typicality_data, by=c("item2"="final_image_name")) %>%
  rename(mean_typicality2=mean_typicality,
         category2=category,
         typicality2=typicality_subjective) %>%
  mutate(avg_dist=dream_distance) %>%
  mutate(
    same_category=ifelse(category1==category2,"same","different")
  )

#create hierarchical clusters for dreamsim

#average distance object organized
dream_dist <- all_distance_data %>%
  nest() %>%
  mutate(dist_obj = purrr::map(data, long_to_dist))

#### create overall cluster objects ####
dream_clusters <- dream_dist %>%
  mutate(cluster=lapply(dist_obj, function(d) clean_cluster(d))) %>%
  mutate(dend = lapply(cluster, function(clst) clst %>% as.dendrogram()))

#look at a clustering solution
dream_clusters %>% pull(dend) %>% pluck(1) %>% plot()

#group by stimulus category

#average distance object organized
dream_dist_by_cat <- all_distance_data %>%
  mutate(stim_category=category1) %>%
  filter(same_category=="same") %>%
  group_by(stim_category) %>%
  nest() %>%
  mutate(dist_obj = purrr::map(data, long_to_dist))

#### create overall cluster objects ####
dream_clusters_by_cat <- dream_dist_by_cat %>%
  mutate(cluster=lapply(dist_obj, function(d) clean_cluster(d))) %>%
  mutate(dend = lapply(cluster, function(clst) clst %>% as.dendrogram()))

#look at a clustering solution
dream_clusters_by_cat %>% filter(stim_category=="dog") %>% pull(dend) %>% pluck(1) %>% plot(main="DOGS")
dream_clusters_by_cat %>% filter(stim_category=="bird") %>% pull(dend) %>% pluck(1) %>% plot(main="BIRDS")
dream_clusters_by_cat %>% filter(stim_category=="cat") %>% pull(dend) %>% pluck(1) %>% plot(main="CATS")
dream_clusters_by_cat %>% filter(stim_category=="fish") %>% pull(dend) %>% pluck(1) %>% plot(main="FISH")

#plot distances
ggplot(all_distance_data,aes(x=category1,y=avg_dist,color=same_category)) +
  geom_violin()+
  geom_boxplot()+
  #geom_jitter(width=0.1)+
  #facet_wrap(~category2+typicality1)
  facet_wrap(~category2)
  

#summarize distances
avg_category_distances <- all_distance_data %>%
  mutate(stim_category=category1) %>%
  group_by(category1,category2,same_category, typicality1,typicality2) %>%
  summarize(
    avg_distance = mean(avg_dist)
  )

#### Exploratory analysis of effect of distances ####
data_file_path <- here::here("..","..","data","processed_data","CATegories_exp2_processed_data_with_exclusion_info.csv")
d <- read_csv(data_file_path) 

# save key columns
key_cols_summarized_trial_data <- c(
  "sub_num","session", "age","age_mo","days_between_sessions", "child_gender", "trial_order","trial_number","condition","target_image","distractor_image","target_category","distractor_category","target_typicality_z","distractor_typicality_z","target_parent_typicality_rating","distractor_parent_typicality_rating","target_parent_typicality_rating_z","distractor_parent_typicality_rating_z","target_parent_typicality_by_category_z","distractor_parent_typicality_by_category_z","mean_target_looking_critical","mean_target_looking_baseline","corrected_target_looking","exclude_participant","age_exclusion","trial_exclusion","trial_exclusion_reason","exclude_technical_issue","exclude_frame_rate","useable_window","useable_critical_window","useable_baseline_window","useable_window_short","total_trials_short","exclude_participant_insufficient_data_short","mean_target_looking_critical_short","corrected_target_looking_short")

#extract summarized trial-level accuracy (see 2_process_exclusions.Rmd for details on how summarized columns are computed)
trial_corrected_accuracy_all <- d %>%
  select(all_of(key_cols_summarized_trial_data)) %>%
  distinct()

trial_corrected_accuracy <- trial_corrected_accuracy_all %>%
  filter(exclude_participant==0) %>%
  filter(trial_exclusion==0)

trial_corrected_accuracy <- d %>%
  filter(exclude_participant==0) %>%
  filter(useable_window==1) %>%
  distinct(sub_num,session, age,age_mo, child_gender, trial_order,trial_number,target_category,left_image, right_image,target_image,target_typicality_z,distractor_typicality_z,target_parent_typicality_rating,distractor_parent_typicality_rating,target_parent_typicality_rating_z,distractor_parent_typicality_rating_z,target_parent_typicality_by_category_z,distractor_parent_typicality_by_category_z, condition,mean_target_looking_critical,mean_target_looking_baseline,corrected_target_looking) %>%
  mutate(
    distractor_image = case_when(
      left_image == target_image ~ right_image,
      right_image == target_image ~ left_image
    )) %>%
  unite(
    image_combos,
    target_image,
    distractor_image,
    remove=FALSE
  )

similarity_data <- read_csv(here("..","..","data","processed_data","categories_dreamsim_image_pairwise_distances.csv")) %>%
  mutate(
    image_1_name=basename(tools::file_path_sans_ext(image_1)),
    image_2_name=basename(tools::file_path_sans_ext(image_2)),
  ) %>%
  tidyr::unite(image_combos,image_1_name,image_2_name,remove=FALSE)

trial_corrected_accuracy <- trial_corrected_accuracy %>%
  left_join(select(similarity_data,image_combos,distance)) %>%
  mutate(distance_c=distance-mean(distance))

#predict mean target looking from distance
m <- lmer(mean_target_looking_critical ~ 1 + distance_c + mean_target_looking_baseline+
            (1+distance_c|sub_num)+
            (1|target_category),
          data=trial_corrected_accuracy)
summary(m) # barely significant effect of distance

#effect holds when controlling for target and distractor typicality
m <- lmer(mean_target_looking_critical ~ 1 + distance_c + distractor_typicality_z*target_ mean_target_looking_baseline+
            (1+distance_c|sub_num)+
            (1|target_category),
          data=trial_corrected_accuracy)
summary(m) # barely significant effect of distance

# looks to be a small (but potentially intriguing) effect
ggplot(trial_corrected_accuracy,aes(distance,corrected_target_looking))+
  geom_point()+
  geom_smooth(method="loess")+
  facet_wrap(~target_category)
