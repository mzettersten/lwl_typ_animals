library(tidyverse)
library(cowplot)
library(here)
library(ggimage)
library(sciplot)
theme_set(theme_cowplot())

root_path <- here()
setwd(root_path)

#read in data
typical <- read.csv("../processed_data/typical_animals_data.csv")
image_info <- read.csv("../processed_data/animal_ratings_stimuli_full.csv")
image_info <- image_info %>%
  mutate(imageName=final_image_name) %>%
  mutate(image_path = paste("../images/",image_experiment_name,sep=""))

#check condition distribution
summarize_conds <- typical %>%
  filter(trial_index==0) %>%
  group_by(condition) %>%
  summarize(N=n())

summarize_category_assignment <- typical %>%
  filter(trial_index==0) %>%
  group_by(category_assignment_1,category_assignment_2) %>%
  summarize(N=n())

summarize_category <- summarize_category_assignment %>%
  pivot_longer(cols=c(category_assignment_1,category_assignment_2),names_to = "category_order",values_to = "category") %>%
  group_by(category) %>%
  summarize(num=sum(N))

#summarize typicality ratings
summarize_typicality <- typical %>%
  filter(trial_type!="instructions") %>%
  group_by(imageName,image) %>%
  summarize(
    N=n(),
    mean_typicality=mean(typicality_rating,na.rm=T),
    sd_typicality=sd(typicality_rating,na.rm=T),
    se_typicality=se(typicality_rating,na.rm=T))

#join with image info
summarize_typicality <- summarize_typicality %>%
  left_join(image_info)

#plot
ggplot(filter(summarize_typicality,category=="dog"),aes(fct_reorder(imageName, mean_typicality),mean_typicality,fill=typicality_subjective,image=image_path))+
  geom_image(size=.05,aes(y = mean_typicality+0.3))+
  geom_bar(stat="identity")+
  geom_errorbar(aes(ymin=mean_typicality-se_typicality,ymax=mean_typicality+se_typicality),width=.05)+
  scale_fill_brewer(palette="Set1",name="Subjective Typicality")+
  theme(axis.text.x  = element_text(angle=90, vjust=0.5, size=16))+
  ylab("Mean Typicality Rating")+
  xlab("Exemplar")+
  theme(legend.position=c(0.1,0.8))
ggsave("figures/dogs_typicality.jpg",width=7, height=7)

ggplot(filter(summarize_typicality,category=="fish"),aes(fct_reorder(imageName, mean_typicality),mean_typicality,fill=typicality_subjective,image=image_path))+
  geom_image(size=.05,aes(y = mean_typicality+0.3))+
  geom_bar(stat="identity")+
  geom_errorbar(aes(ymin=mean_typicality-se_typicality,ymax=mean_typicality+se_typicality),width=.05)+
  scale_fill_brewer(palette="Set1",name="Subjective Typicality")+
  theme(axis.text.x  = element_text(angle=90, vjust=0.5, size=16))+
  ylab("Mean Typicality Rating")+
  xlab("Exemplar")+
  theme(legend.position=c(0.1,0.8))
ggsave("figures/fish_typicality.jpg",width=7, height=7)

ggplot(filter(summarize_typicality,category=="cat"),aes(fct_reorder(imageName, mean_typicality),mean_typicality,fill=typicality_subjective,image=image_path))+
  geom_image(size=.05,aes(y = mean_typicality+0.3))+
  geom_bar(stat="identity")+
  geom_errorbar(aes(ymin=mean_typicality-se_typicality,ymax=mean_typicality+se_typicality),width=.05)+
  scale_fill_brewer(palette="Set1",name="Subjective Typicality")+
  theme(axis.text.x  = element_text(angle=90, vjust=0.5, size=16))+
  ylab("Mean Typicality Rating")+
  xlab("Exemplar")+
  theme(legend.position=c(0.1,0.8))
ggsave("figures/cat_typicality.jpg",width=7, height=7)

ggplot(filter(summarize_typicality,category=="bird"),aes(fct_reorder(imageName, mean_typicality),mean_typicality,fill=typicality_subjective,image=image_path))+
  geom_image(size=.05,aes(y = mean_typicality+0.3))+
  geom_bar(stat="identity")+
  geom_errorbar(aes(ymin=mean_typicality-se_typicality,ymax=mean_typicality+se_typicality),width=.05)+
  scale_fill_brewer(palette="Set1",name="Subjective Typicality")+
  theme(axis.text.x  = element_text(angle=90, vjust=0.5, size=16))+
  ylab("Mean Typicality Rating")+
  xlab("Exemplar")+
  theme(legend.position=c(0.1,0.8))
ggsave("figures/bird_typicality.jpg",width=7, height=7)

write.csv(summarize_typicality, "../processed_data/typicality_animals_summarized.csv", row.names=F)

