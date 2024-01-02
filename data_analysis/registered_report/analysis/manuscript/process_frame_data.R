library(tidyverse)
library(here)
library(lubridate)

frame_data_path <- here("..","..","frame_data","CATegories--a-study-about-animal-names_framedata_per_session")
write_data_path <- here("..","..","data","processed_data", "CATegories_exp2_processed_frame_data.csv")


read_and_combine_data <- function(data_path, column_types=NULL, file_ext = ".csv") {
  filepaths <- list.files(data_path, full.names = TRUE, pattern = file_ext)
  full_dataset <- map(filepaths, ~{read_csv(.x,col_types = column_types)}) %>% 
    bind_rows()
  full_dataset
}

all_frame_data <- read_and_combine_data(frame_data_path)

#filter only to relevant trials
frame_data <- all_frame_data %>%
  filter(str_detect(frame_id,"order"))

#pivot keys and values wider
frame_data_trial <- frame_data %>%
  group_by(response_uuid,child_hashed_id,frame_id) %>%
  pivot_wider(names_from="key",values_from="value")

#extract main overall trial info
#pattern for matching the order structure (frame_id)
pattern <- "^(\\d+)-(.+)-trial-(\\d+)$"
frame_data_trial_info <- frame_data_trial %>%
  filter(is.na(event_number)) %>%
  #prune unused columns
  select(-event_number,-eventType,-timestamp,-streamTime,-hasCamAccess,-status,-pipeId) %>%
  mutate(
    left_image_full_path = case_when(
    images.0.position == "left" ~ images.0.src),
    right_image_full_path = case_when(
      images.1.position == "right" ~ images.1.src)) %>%
  mutate(
    left_image=basename(left_image_full_path),
    right_image=basename(right_image_full_path),
    audio=basename(audioPlayed)
  ) %>%
  mutate(
    overall_trial_number = str_match(frame_id, pattern)[, 2],
    order_name = str_match(frame_id, pattern)[, 3],
    trial_number = str_match(frame_id, pattern)[, 4]
  ) %>%
  mutate(
    frame_duration=as.numeric(frameDuration)
  ) %>%
  select(response_uuid,child_hashed_id,frame_id,videoId,order_name,overall_trial_number,trial_number,left_image,right_image,audio,frame_duration) %>%
  filter(!is.na(videoId))
  
op <- options(digits.secs=3)

frame_data_event_info <- frame_data_trial %>%
  filter(!is.na(event_number)) %>%
  select(response_uuid,child_hashed_id,frame_id,eventType,timestamp,streamTime) %>%
  separate(eventType,into=c("trial_type","event"),sep=":") %>%
  mutate(time_clean = lubridate::ymd_hms(timestamp)) %>% 
  mutate(date = format(time_clean,format = '%F'), 
         time = format(time_clean,format = '%H:%M:%OS')) %>%
  # pivot_wider(names_from=event,
  #             values_from=c(timestamp, streamTime))
  group_by(response_uuid,child_hashed_id,frame_id,event) %>%
  summarize(time_clean=time_clean) %>%
  ungroup() %>%
  group_by(response_uuid,child_hashed_id,frame_id) %>%
  pivot_wider(names_from=event,values_from=time_clean) %>%
  rename(
    video_start_time = startRecording,
    video_stop_time = stoppingCapture,
    audio_start_time = startAudio,
    audio_finish_time = finishAudio
  )
frame_data_event_info <- frame_data_event_info %>%
  unnest(cols=c(displayImages,startTimer,endTimer,trialComplete,pauseStudy,resumeStudy,video_start_time,video_stop_time,audio_start_time,audio_finish_time)) %>%
  filter(!is.na(video_start_time)) %>%
  mutate(
    video_capture_time = difftime(video_stop_time,video_start_time,units="auto"),
    audio_time = difftime(audio_finish_time,audio_start_time,units="auto"),
    audio_lag_vs_video = difftime(audio_start_time,video_start_time,units="auto"),
    audio_lag_vs_display_images = difftime(audio_start_time,displayImages,units="auto"),
    audio_lag_vs_start_timer = difftime(audio_start_time,startTimer,units="auto"),
    video_end_minus_audio_end = difftime(video_stop_time,audio_finish_time,units="auto"),
    pause_time = difftime(resumeStudy,pauseStudy,units="auto")) %>%
  mutate(
    audio_time_s=as.numeric(audio_time),
    audio_lag_vs_video_s = as.numeric(audio_lag_vs_video),
    audio_end_minus_video_end_s = as.numeric(video_end_minus_audio_end),
    audio_lag_vs_display_images_s = as.numeric(audio_lag_vs_display_images),
    audio_lag_vs_start_timer_s = as.numeric(audio_lag_vs_start_timer)
  ) %>%
  select(-enteredFullscreen,-leftFullscreen,-videoStreamConnection,-setupVideoRecorder,-recorderReady,-recorder.hasCamAccess,-nextFrame,-destroyingRecorder) %>%
  select(-displayImages,-endTimer,-audio_finish_time,-audio_start_time,-video_start_time,-startTimer,-video_stop_time,-trialComplete)

#join in frame trial info
frame_data_event_info <- frame_data_event_info %>%
  left_join(frame_data_trial_info)

write_csv(frame_data_event_info,write_data_path)  
  
  