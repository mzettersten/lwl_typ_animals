library(tidyverse)
library(here)
library(fs)

typicality_data_path <- here("..","..","data","processed_data","typicality_animals_summarized.csv")
dream_data_path <- here("..","..","data","processed_data","categories_dreamsim_image_pairwise_distances.csv")

dream_distances <- read_csv(dream_data_path) %>%
  mutate(
    item1=tools::file_path_sans_ext(path_file(image_1)),
    item2=tools::file_path_sans_ext(path_file(image_2)),
    animal1=str_remove(item1,"_600x600"),
    animal2=str_remove(item2,"_600x600")
  ) %>%
  rename(
    dream_distance=distance
  )

typicality_data <- read_csv(typicality_data_path) %>%
  select(final_image_name,mean_typicality,category, typicality_subjective)

all_distance_data <- dream_distances %>%
  left_join(typicality_data, by=c("animal1"="final_image_name")) %>%
  rename(mean_typicality1=mean_typicality,
         category1=category,
         typicality1=typicality_subjective) %>%
  left_join(typicality_data, by=c("animal2"="final_image_name")) %>%
  rename(mean_typicality2=mean_typicality,
         category2=category,
         typicality2=typicality_subjective)
