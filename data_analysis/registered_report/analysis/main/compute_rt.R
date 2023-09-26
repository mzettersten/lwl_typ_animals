library(tidyverse)
library(here)
source(here::here("rt_helper.R"))
data_file_path <- here::here("..","..","data","processed_data","CATegories_exp2_processed_data_anonymized.csv")
d <- read_csv(data_file_path)

#convert to rle data
rle_data <- d %>%
  filter(any(time_centered == 0), # must have data at 0
         time_centered >= 0) %>% # only pass data after 0
  mutate(
    aoi = case_when(
      accuracy_transformed == 1 ~ "target",
      accuracy_transformed == 0 ~ "distractor",
      is.na(accuracy_transformed) ~ "other"
    )
  ) %>%
  group_by(sub_num, session,trial_number, trial_order_x) %>%
  summarise(lengths = rle(aoi)$lengths, 
            values = rle(aoi)$values)

# compute RTs
d_rt <- rle_data %>%
  group_by(sub_num, session,trial_number, trial_order_x) %>%
  nest() %>%
  mutate(data = lapply(data, get_rt)) %>%
  unnest(cols = c(data))

#quick plot of distribution
hist(filter(d_rt, shift_type=="D-T")$shift_start_rt)

  