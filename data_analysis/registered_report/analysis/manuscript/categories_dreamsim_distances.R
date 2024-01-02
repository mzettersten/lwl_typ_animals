library(tidyverse)
library(here)
library(fs)
library(harrietr) #need to have ggtree installed too, download from github if necessary
library(dendextend)

source(here::here("helper.R"))

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
