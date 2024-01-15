CATegories Registered Report README - Data Files

The folder "processed_data" contains all of the main data files for the Registered Report experiment. Below is an overview of the main data files.

* **animal_ratings_stimuli_full.csv**: Metadata file containing information about each image and image name.
* **CATegories_analysis_window_frame_ranges.csv**: Trial-by-trial analyzed frame ranges for each participant and session (used in computing reliability)
* **categories_dreamsim_image_pairwise_distances.csv**: Pairwise distances between images computed using DreamSim (https://dreamsim-nights.github.io/). Smaller distances correspond to higher similarity, as estimated by the DreamSim model
* **CATegories_exclusion_info.csv**: Summary of participant-level exclusions
* **CATegories_exp2_peyecoder_data_anonymized.csv**: The manually coded frame-by-frame looking data, removing deanonymizing information
* **CATegories_exp2_processed_data_resampled.csv**: Frame-by-frame looking data resampled to one consistent frame rate (15 Hz)
* **CATegories_exp2_processed_data_with_exclusion_info.csv**: Main data file with frame-by-frame looking data integrated with metadata, also including exlusion information (omitted due to size on GitHub)
* **CATegories_exp2_processed_data_with_exclusion_info.rds**: Main data file with frame-by-frame looking data integrated with metadata, also including exlusion information, stored in (more compact) .Rds format
* **CATegories_exp2_processed_data.csv**: Main data file with frame-by-frame looking data integrated with metadata (omitted due to size on GitHub)
* **CATegories_exp2_processed_data.rds**: Main data file with frame-by-frame looking data integrated with metadata stored in (more compact) .Rds format
* **CATegories_exp2_processed_frame_data.csv**: Trial information and timing properties extracted from the Lookit log files for each participant and session
* **CATegories_exp2_processed_participant_data_anonymized.csv**: Participant information (including demographic data) - cleaned to remove potentially de-anonymizing information
* **CATegories_exp2_processed_survey_data.csv**: Data from the parental survey (processed and cleaned to remove deanonymizing information)
* **CATegories_exp2_RT_by_trial.csv**: Data file containing trial-by-trial reaction times for each participant and session
* **CATegories_exp2_trial_summary_data.csv**: Data file summarizing key trial-by-trial information for each participant and session (including proportion target looking, and metadata)
* **CATegories_exp2_useable_trial_summary.csv**: Data file summarizing information about useable trials for each participant
* **frame_rate_tables**: Folder containing tables of the trial-wise frame rates for each video session, after postprocessing of the Lookit videos
* **typicality_animals_summarized.csv**: Metadata file containing information about typicality norms (from the typicality norming study) for each individual image