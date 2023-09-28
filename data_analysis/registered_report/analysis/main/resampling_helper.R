#stolen from peekbank/ peekds
#https://github.com/langcog/peekds/blob/master/R/generate_aoi.R

resample_aoi_trial <- function(df_trial, sample_duration=1000/30) {
  
  print(paste0("Subject Number: ",unique(df_trial$sub_num), "; Trial Number: ", unique(df_trial$trial_number)))
  
  t_origin <- df_trial$t_norm
  data_origin <- df_trial$aoi
  
  # create the new timestamps for resampling
  t_start <- min(t_origin) - (min(t_origin) %% sample_duration)
  t_resampled <- seq(from = t_start, to = max(t_origin),
                     by = sample_duration)
  
  # exchange strings values with integers for resampling
  # this step critical for interpolating missing vals quickly and correctly
  aoi_num <- data_origin %>%
    dplyr::recode(target = 1, distractor = 2, other = 3, missing = 4)
  
  # start resampling with approx
  aoi_resampled <- stats::approx(x = t_origin, y = aoi_num, xout = t_resampled,
                                 method = "constant", rule = 2,
                                 ties = "ordered")$y
  aoi_resampled_recoded <- aoi_resampled %>%
    dplyr::recode("1" = "target", "2" = "distractor",
                  "3" = "other", "4" = "missing")
  
  
  # adding back the columns to match schema
  dplyr::tibble(t_norm = t_resampled,
                aoi = aoi_resampled_recoded,
                trial_id = df_trial$trial_id[1],
                administration_id = df_trial$administration_id[1])
}

resample_times <- function(df_table, sample_duration) {
  
  # first check if this data frame has all the correct columns required for
  # re-sampling
  required_columns <- c("trial_id", "administration_id", "t_norm", "aoi")
  
  # re-zero and normalize times first
  # this is mandatory, comes from our decision that not linking resampling and
  # centering causes a lot of problems
  if (!all(required_columns %in% colnames(df_table))) {
    stop(.msg("Resample times function requires the following columns to be
              present in the dataframe:
              {paste(required_columns, collapse = ', ')}. Times should be
              re-zeroed and normalized first before being resampled!"))
  }
  
  # main resampling call
    # start resampling process by iterating through every trial within every
    # administration
    df_out <- df_table %>%
      dplyr::mutate(admin_trial_id = paste(.data$administration_id,
                                           .data$trial_id, sep = "_")) %>%
      split(.$admin_trial_id) %>%
      purrr::map_df(resample_aoi_trial) %>%
      dplyr::arrange(.data$administration_id, .data$trial_id)
  
  return(df_out)
}
