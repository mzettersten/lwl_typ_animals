library(tidyverse)
library(jsonlite)
library(readxl)

#### frame list ####

#sheet list
sheet_list <- c("order1A","order1A_locationflip","order1B","order1B_locationflip","order2A","order2A_locationflip","order2B","order2B_locationflip")


#### parameters
img_extension <- ".jpg"
kind_info <- "group"

for (sheet in sheet_list) {
  print(sheet)
  #clean sheet name
  sheet_name <- str_replace(sheet, "_", "-")
  cur_trial_list <- read_excel("CATegories_orders.xlsx",sheet=sheet)
  trial_num <- nrow(cur_trial_list[,1])
  #id
  id_list <- paste(sheet_name,"trial",cur_trial_list$trial_number,sep="-")
    
  #audio
  audio_list <- cur_trial_list$auditory_stimulus
  #images
  image_list <- list()
  for (i in 1:trial_num) {
    print(i)
    cur_image_frame <- tibble(
      id = c(paste(sheet_name,"trial",i,"left",sep="-"),paste(sheet_name,"trial",i,"right",sep="-")), 
      src = c(paste(cur_trial_list$left_image[i],img_extension,sep=""),paste(cur_trial_list$right_image[i],img_extension,sep="")), 
      position = c("left","right"))
    image_list[[i]] <- cur_image_frame
  }
  
  frame_list <- tibble(
    id = id_list,
    audio = audio_list,
    images = image_list
  )
  
  frame_list_json <- toJSON(frame_list,pretty=TRUE)
  
  json_name=paste(sheet,"framelist.json",sep="_")
  
  write(frame_list_json, json_name)
}









  







