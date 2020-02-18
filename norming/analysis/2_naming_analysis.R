library(tidyverse)
library(cowplot)
library(here)
library(ggimage)
theme_set(theme_cowplot())
root_path <- here()
setwd(root_path)

naming <- read.csv("../processed_data/naming_animals_data_filtered.csv")
image_info <- read.csv("../processed_data/animal_ratings_stimuli_full.csv")
image_info <- image_info %>%
  mutate(imageName=final_image_name) %>%
  mutate(image_path = paste("../images/",image_experiment_name,sep=""))
#join
naming <- naming %>%
  left_join(image_info)

#check condition distribution
summarize_conds <- naming %>%
  filter(trial_index!=0) %>%
  group_by(category, typicality_subjective,imageName) %>%
  summarize(N=n())

#exclude non-native speakers
naming <- naming  %>%
  mutate(native_lang_english=case_when(
    languages_besides_english=="No" ~ 1,
    str_detect(native_language, "english") ~ 1,
    native_language==""& str_detect(tolower(language_1), "english") ~ 1,
    TRUE ~ 0
  ))
length(unique(naming$qualtricsId[naming$native_lang_english==0]))
naming <- naming %>%
  filter(native_lang_english==1)

#filter out instructions and unused columns
naming <- naming %>%
  filter(trial_type!="instructions") %>%
  select(-view_history)

#summarize naming
summarize_naming <- naming %>%
  group_by(category,typicality_subjective,imageName,image) %>%
  summarize(
    N=n(),
    modal_label =names(which.max(table(naming_response))),
    modal_label_count = sum(naming_response==modal_label),
    modal_agreement = modal_label_count/N)

#join with image info
summarize_naming <- summarize_naming %>%
  left_join(image_info)

ggplot(summarize_naming, aes(modal_agreement))+
  geom_histogram()+
  facet_wrap(~category)

write.csv(summarize_naming,"../processed_data/naming_animals_summarized.csv", row.names=F)
