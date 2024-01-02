# remotes::install_github("jmgirard/agreement")
library(agreement)

# key ICC function
get_icc <- function (x, column = "accuracy", object = "stimulus", type_icc = "consistency") {
  if (object == "stimulus") {
    iccs <- dim_icc(x, 
                    model = "2A", 
                    type = type_icc, 
                    unit = "average",
                    object = target_label, 
                    rater = administration_id,
                    trial = trial_id, 
                    score = {{column}},
                    bootstrap=0)
  } else {
    iccs <- dim_icc(x, 
                    model = "2A", 
                    type = type_icc, 
                    unit = "average",
                    object = administration_id, 
                    rater = target_label,
                    trial = trial_id, 
                    score = {{column}},
                    bootstrap=0)
  }
  
  return(iccs$Inter_ICC)
}
