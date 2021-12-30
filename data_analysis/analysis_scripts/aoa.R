library(wordbankr)
library(tidyverse)

#### Script for extracting AOA information from Wordbank
#### Focused here on animal items

#get ids
animals_ws <- get_item_data(language = "English (American)", form = "WS") %>%
  filter(category == "animals")
animals_wg <- get_item_data(language = "English (American)", form = "WG") %>%
  filter(category == "animals")

#get data
## WS
eng_ws_animals_data <- get_instrument_data(language = "English (American)",
                                   form = "WS",
                                   items = animals_ws$item_id,
                                   administrations=TRUE,
                                   iteminfo=TRUE)
## WG
eng_wg_animals_data <- get_instrument_data(language = "English (American)",
                                           form = "WG",
                                           items = animals_wg$item_id,
                                           administrations=TRUE,
                                           iteminfo=TRUE)
#fit aois
## WG
animal_aoas_wg_produces <- fit_aoa(eng_wg_animals_data,measure="produces",age_min=0)
animal_aoas_wg_understands <- fit_aoa(eng_wg_animals_data,measure="understands",age_min=0)
## WS
animal_aoas_ws_produces <- fit_aoa(eng_ws_animals_data,measure="produces",age_min=0)

#just dog, cat, bird, fish
categories_stim_wg <- eng_wg_animals_data %>%
  filter(definition %in% c("dog","bird","fish (animal)","cat"))

categories_aoas_wg_produces <- fit_aoa(categories_stim_wg,measure="produces",age_min=0)
categories_aoas_wg_understands <- fit_aoa(categories_stim_wg,measure="understands",age_min=0)
