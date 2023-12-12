#common
library(tidyverse)
library(broom.mixed)

summarize_mixed_effects_coef(model)

summarize_mixed_effects_model <- function(model) {
  #compute Wald 95% CI
  model_confint <- model %>%
    stats::confint(method="Wald") %>%
    as.tibble(rownames="term") %>%
    rename(lower_ci = `2.5 %`,
           upper_ci = `97.5 %`) %>%
    filter(!is.na(lower_ci))
  
  #combine model summary
  model_tidy <- model %>%
    broom.mixed::tidy() %>%
    left_join(model_confint)
  model_tidy
}
