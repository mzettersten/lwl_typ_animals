library(tidyverse)
library(cowplot)
library(here)
library(ggimage)
library(sciplot)
theme_set(theme_cowplot())

root_path <- here()
setwd(root_path)

summarized_naming <- read.csv("../processed_data/naming_animals_summarized.csv")
summarized_typicality <- read.csv("../processed_data/typicality_animals_summarized.csv")

overall_d <- summarized_naming %>%
  filter(!is.na(category)) %>%
  rename(N_name=N) %>%
  left_join(summarized_typicality) %>%
  rename(N_typicality=N)

#how correlated are typicality and nameability?
ggplot(overall_d, aes(mean_typicality,modal_agreement)) +
  geom_point()+
  geom_smooth(method="lm")+
  ylim(0,1)
ggplot(overall_d, aes(mean_typicality,modal_agreement)) +
  geom_point()+
  geom_smooth(method="lm",se=F)+
  facet_wrap(~category)+
  ylim(0,1)
#not very much within each category!

#define naming in terms of category  label or not
overall_d <- overall_d  %>%
  mutate(modal_label_is_basic=if_else(as.character(modal_label)==as.character(category),1,0)) %>%
  group_by(category) %>%
  mutate(median_typicality_by_category=median(mean_typicality)) %>%
  ungroup()

table(overall_d$modal_label_is_basic,overall_d$category)
#plot naming and typicality quadrants

ggplot(overall_d, aes(mean_typicality,modal_agreement,color=as.factor(modal_label_is_basic),image=image_path)) +
  geom_point()+
  geom_image(size=.06,aes(y = modal_agreement+0.03,color=NULL))+
  geom_vline(aes(xintercept=median_typicality_by_category,color=NULL, image=NULL))+
  geom_hline(yintercept=0.5)+
  facet_wrap(~category)+
  theme(legend.position=c(0.6,0.6))
ggsave("figures/naming_vs_typicality.jpg",width=9, height=7)


