library(tidyverse)
library(here)
source("rt_helper.R")
source("resampling_helper.R")
data_file_path <- here::here("data_analysis","registered_report","data","processed_data","CATegories_exp2_processed_data_anonymized.csv")
d <- read_csv(data_file_path)

#resample times
resampled_d <- d %>%
  mutate(
    aoi = case_when(
      accuracy_transformed == 1 ~ "target",
      accuracy_transformed == 0 ~ "distractor",
      is.na(accuracy_transformed) ~ "other"
    )
  ) %>%
  mutate(t_norm=time_centered,
         trial_id = trial_number,
         administration_id = paste(sub_num,session,sep="_")) %>%
  resample_times() #time resampling is set to 30 Hz

#convert to rle data
rle_data <- resampled_d %>%
  filter(any(t_norm == 0), # must have data at 0
         t_norm >= 0) %>% # only pass data after 0 
  separate(administration_id,into=c("exp_id","sub_number","session"),sep="_",remove=FALSE) %>%
  unite("sub_num",exp_id,sub_number,sep="_") %>%
  mutate(trial_number=trial_id) %>%
  group_by(sub_num, session,trial_number) %>%
  summarise(lengths = rle(aoi)$lengths, 
            values = rle(aoi)$values)

# compute RTs
d_rt <- rle_data %>%
  group_by(sub_num, session,trial_number) %>%
  nest() %>%
  mutate(data = lapply(data, get_rt)) %>%
  unnest(cols = c(data))

# write RT data frame
write_csv(d_rt,here::here("data_analysis","registered_report","data","processed_data","CATegories_exp2_RT_by_trial.csv"))


#quick plot of distribution
hist(filter(d_rt, shift_type=="D-T")$shift_start_rt)

  