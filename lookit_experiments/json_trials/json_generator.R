library(tidyverse)
library(jsonlite)

#### read in csv ####
trial_list_1 <- read.csv("demo_trial_list.csv")


#### parameter list ####
convert_order <- function(trial_list) {
  trial_list_wide <- trial_list %>%
    select(trial_number,auditory_stimulus,left_image,right_image) %>%
    rename(
      trial = trial_number,
      Audio = auditory_stimulus,
      Left = left_image,
      Right = right_image
    ) %>%
    mutate(
      Left=paste(Left,"_600x600.jpg",sep=""),
      Right=paste(Right,"_600x600.jpg",sep="")) %>%
    pivot_wider(
      names_from=trial,values_from=c(Audio,Left,Right),names_prefix="trial"
    ) %>%
    setNames(nm = sub("(.*)_(.*)", "\\2_\\1", names(.)))
  
  colnames(trial_list_wide) <- gsub("_","",colnames(trial_list_wide))
  
  return(trial_list_wide)
}

order_1 <- convert_order(trial_list_1)
order_2 <- convert_order(trial_list_1)

parameter_list <- bind_rows(
  order_1,
  order_2
)

parameter_list_json <- toJSON(parameter_list,pretty=TRUE)


write(parameter_list_json, "parameter_list_json.json")

### frame list ###

#### parameters
trial_num <- length(trial_list[,1])
endSessionRecording_list <- c(rep(NA,trial_num-1),TRUE)
calibrationLength <- 4000
kind_info <- "exp-lookit-calibration"


framelist_initializer <- tibble(
  kind = kind_info,
  calibrationLength = calibrationLength,
  startSessionRecording = TRUE,
  audio = NA,
  endSessionRecording = NA
)

audio_list <- paste("trial",seq(1:trial_num),"Audio",sep="")
image_list <- list()

for (i in 1:trial_num) {
  print(i)
  cur_image_frame <- tibble(
      id = c(paste("L",i,sep=""),paste("R",i,sep="")), 
      src = c(paste("trial",i,"Left",sep=""),paste("trial",i,"Right",sep="")), 
      position = c("left","right"))
  image_list[[i]] <- cur_image_frame
}
  

frame_list <- tibble(
  audio = audio_list,
  images = image_list,
  endSessionRecording = endSessionRecording_list
)

frame_list_complete <- bind_rows(
  framelist_initializer,frame_list)

frame_list_json <- toJSON(frame_list_complete,pretty=TRUE)

write(frame_list_json, "frame_list_json.json")

