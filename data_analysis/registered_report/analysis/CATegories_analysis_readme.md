CATegories Registered Report README - Analysis Scripts

The folder "manuscipt" contains all of the main analysis scripts required to reproduce the analyses for the Registered Report experiment. Below is an overview of the main analysis files.

* (**0_preprocessing.Rmd**): Step 0 in the processing pipeline - all sensitive information is handled and deanonymized in this preprocessing step (currently omitted on GitHub)
* **1_process_looking_data.Rmd**: Step 1 in the processing pipeline - all of the main processing of the looking data and integration with metadata is handled during this step
* **2_process_exclusions.Rmd**: Step 2 in the processing pipeline - the processing of exclusions happens in this step
* **3_compute_rt.R**: Step 3 in the processing pipeline - script for computing reaction times (in particular the data file **CATegories_exp2_RT_by_trial.csv**
* **categories_dreamsim_distances.R**: Data file for evaluating properties of the DreamSim distances data (not currently used - planned for additional exploratory analyses)
* **CATegories_main_data_codebook.csv**: codebook for the main CATegories data file (including exclusion information)
* **cluster_permutation_analysis.html**: HTML render of the R markdown for performing cluster-based permutation analyses
* **cluster_permutation_analysis.Rmd**: R markdown for performing cluster-based permutation analyses
* **common.R**: script for commonly used R functions
* **compute_iccs.R**: function for computing intraclass correlation coefficients (ICCs)
* **images**: folder containing all (normed) images - used to generate figures in the main analyses
* **main_analysis.html**: HTML render of the main analysis R markdown script
* **main_analysis.Rmd**: main analysis R markdown script
* **manuscript.Rproj**: R project file for the main analyses
* **process_frame_data.R**: script for processing Lookit frame data (logs) - this scripts generates **CATegories_exp2_processed_frame_data.csv**
* **resampling_helper.R**: script containing main R functions for resampling looking data
* **rt_helper.R**: script containing main R function for computing reactions times