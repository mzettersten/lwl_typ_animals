# CATegories
Materials, data, and analysis for a study on the development of category-based word knowledge/ expertise in word meanings.

[authors removed for peer review] (Stage 2 registered report under review). Becoming word meaning experts: Infants’ processing of familiar words in the context of typical and atypical exemplars. In-principle acceptance of Stage 1 RR at Child Development. Preprint: [redacted for peer review].

**Abstract**

How do infants become word meaning experts? This registered report investigated the structure of infants’ early lexical representations by manipulating the typicality of exemplars from familiar animal categories. 14- to 18-month-old infants (N=84; 51 female; M=15.7 months; race/ethnicity: 64% White, 8% Asian, 2% Hispanic, 1% Black, 23% multiple categories) were tested on their ability to recognize typical and atypical category exemplars after hearing familiar basic-level category labels. Infants robustly recognized both typical (d=0.79, 95% CI [0.54, 1.03]) and atypical (d=0.73, 95% CI [0.48, 0.97]) exemplars, with no significant difference between typicality conditions (d=0.13, 95% CI [-0.08, 0.35]). These results support a broad-to-narrow account of infants’ early word meanings. Implications for the role of experience in the development of lexical knowledge are discussed.

## Link to the OSF project

https://osf.io/3t8gf/?view_only=d4031533ac8549d5a8682b7819ba7bee

## Overview over folder structure

```
├── data_analysis
│   ├── pilot
│   │   ├── analysis_scripts
│   │   ├── data
│   │   ├── figures
│   │   └── power_simulation
│   └── registered_report
│       ├── analysis
│       │   ├── figures
│       │   └── manuscript
│       └── data
│           └── processed_data
├── figures
├── lookit_experiments
│   ├── img
│   ├── json_trials
│   ├── mp3
│   ├── mp4
│   └── ogg
├── lwl_experiment_demo
├── norming
│   ├── analysis
│   ├── images
│   ├── norming_experiments
│   │   ├── name_animals
│   │   └── typical_animals
│   └── processed_data
└── stimuli
    ├── final_image_list.xlsx
    └── final_images
```

## Details on individual folders

Below are more detailed explanations of individual folder components

### Data Analysis

This folder contains the data anad analysis scripts for both the pilot and the registered report experiment.

* **registered_report**: contains the data and analysis scripts for the main experiment in the registered report.
    * **analysis/figures**: Figures generated by the analysis scripts
    * **analysis/manuscript**: Main analysis scripts
      - (**0_preprocessing.Rmd**): Step 0 in the processing pipeline - all sensitive information is handled and deanonymized in this preprocessing step (currently omitted on GitHub)
      - **1_process_looking_data.Rmd**: Step 1 in the processing pipeline - all of the main processing of the looking data and integration with metadata is handled during this step
      - **2_process_exclusions.Rmd**: Step 2 in the processing pipeline - the processing of exclusions happens in this step
      - **categories_dreamsim_distances.R**: Data file for evaluating properties of the DreamSim distances data (not currently used - planned for additional exploratory analyses)
      - **CATegories_main_data_codebook.csv**: Codebook for the main CATegories data file (including exclusion information)
      - **cluster_permutation_analysis.html**: HTML render of the R markdown for performing cluster-based permutation analyses
      - **cluster_permutation_analysis.Rmd**: R markdown for performing cluster-based permutation analyses
      - **common.R**: script for commonly used R functions
      - **compute_iccs.R**: function for computing intraclass correlation coefficients (ICCs)
      - **compute_rt.R**: script for computing reaction times (in particular the data file **CATegories_exp2_RT_by_trial.csv**
      - **images**: folder containing all (normed) images - used to generate figures in the main analyses
      - **main_analysis.html**: HTML render of the main analysis R markdown script
      - **main_analysis.Rmd**: main analysis R markdown script
      - **manuscript.Rproj**: R project file for the main analyses
      - **process_frame_data.R**: script for processing Lookit frame data (logs) - this scripts generates **CATegories_exp2_processed_frame_data.csv**
      - **resampling_helper.R**: script containing main R functions for resampling looking data
      - **rt_helper.R**: script containing main R function for computing reactions times
    * **data/processed_data**: This folder contains all of the main data files for the Registered Report experiment
      - **animal_ratings_stimuli_full.csv**: Metadata file containing information about each image and image name.
      - **CATegories_analysis_window_frame_ranges.csv**: Trial-by-trial analyzed frame ranges for each participant and session (used in computing reliability)
      - **categories_dreamsim_image_pairwise_distances.csv**: Pairwise distances between images computed using DreamSim (https://dreamsim-nights.github.io/). Smaller distances correspond to higher similarity, as estimated by the DreamSim model
      - **CATegories_exclusion_info.csv**: Summary of participant-level exclusions
      - **CATegories_exp2_peyecoder_data_anonymized.csv**: The manually coded frame-by-frame looking data, removing deanonymizing information
      - **CATegories_exp2_processed_data_resampled.csv**: Frame-by-frame looking data resampled to one consistent frame rate (15 Hz)
      - **CATegories_exp2_processed_data_with_exclusion_info.csv**: Main data file with frame-by-frame looking data integrated with metadata, also including exlusion information (omitted due to size on GitHub)
      - **CATegories_exp2_processed_data_with_exclusion_info.rds**: Main data file with frame-by-frame looking data integrated with metadata, also including exlusion information, stored in (more compact) .Rds format
      - **CATegories_exp2_processed_data.csv**: Main data file with frame-by-frame looking data integrated with metadata (omitted due to size on GitHub)
      - **CATegories_exp2_processed_data.rds**: Main data file with frame-by-frame looking data integrated with metadata stored in (more compact) .Rds format
      - **CATegories_exp2_processed_frame_data.csv**: Trial information and timing properties extracted from the Lookit log files for each participant and session
      - **CATegories_exp2_processed_participant_data_anonymized.csv**: Participant information (including demographic data) - cleaned to remove potentially de-anonymizing information
      - **CATegories_exp2_processed_survey_data.csv**: Data from the parental survey (processed and cleaned to remove deanonymizing information)
      - **CATegories_exp2_RT_by_trial.csv**: Data file containing trial-by-trial reaction times for each participant and session
      - **CATegories_exp2_trial_summary_data.csv**: Data file summarizing key trial-by-trial information for each participant and session (including proportion target looking, and metadata)
      - **CATegories_exp2_useable_trial_summary.csv**: Data file summarizing information about useable trials for each participant
      - **frame_rate_tables**: Folder containing tables of the trial-wise frame rates for each video session, after postprocessing of the Lookit videos
      - **typicality_animals_summarized.csv**: Metadata file containing information about typicality norms (from the typicality norming study) for each individual image
* **pilot**: contains the data and analysis scripts for the pilot study

### Figures

The main figures included in the registered report.

### Lookit Experiments

This folder includes the main stimuli and trial information used in the Lookit experiments reported in the registered report.

### LWL Experiment Demo

Demo of experiment testing word recognition for typical and atypical exemplars in a looking-while-listening paradigm.

[Click here to view the demo](https://mzettersten.github.io/lwl_typ_animals/lwl_experiment_demo/index.html) 

(Note that your  browser window will go to fullscreen. Click Esc if you would like to leave fullscreen mode).

[An example trial list can be viewed here](https://docs.google.com/spreadsheets/d/1pub4ZIhPw9XYxMUPjyrj3eIku_YdQ1TYmEu8WPwyiDw/edit?usp=sharing)

### Norming: Nameability and Typicality Ratings

The folder *norming* contains experimental scripts for collecting stimulus ratings, data, and analysis scripts.

![nameability vs. typicality across stimuli](https://github.com/mzettersten/lwl_typ_animals/blob/master/norming/analysis/figures/naming_vs_typicality.jpg)

Link to norming studies (demo):

- [nameability ratings demo](https://mzettersten.github.io/lwl_typ_animals/norming/norming_experiments/name_animals/name_animals.html)

- [typicality ratings demo](https://mzettersten.github.io/lwl_typ_animals/norming/norming_experiments/typical_animals/typical_animals.html)

### Stimuli

Repository containing images of typical and atypical category members (current categories: bird, cat, dog, fish). This is the full set of images that were included in our norming studies, not the final set of images used in the experiment in the Registered Report. For the final images used in the registered report, see the folder **lwl_experiment_demo** > **stimuli** > **images**
