function generateProtocol(child, pastSessions) {

    var condition_list = ["cond-1A", "cond-1B", "cond-2A", "cond-2B", "cond-1A-locationflip", "cond-1B-locationflip", "cond-2A-locationflip", "cond-2B-locationflip"];
    //select a default condition for the session
    var condition = condition_list[Math.floor(Math.random() * condition_list.length)];

    //console.log(pastSessions[1].get('conditions'));
    //console.log(pastSessions[1].get('expData'));

    var debrief_text = "You just completed session one of two for this study! After you exit this experiment, we will check that your consent video meets our eligibility criteria and send you a $5 Amazon gift card (US) within one week of participating. You will also get a link to complete session 2 of the study <b> over the next week</b>. You will receive an addition $5 when you complete the second study session.</br></br>In this study, we are interested in how babies learn that words, such as <i>dog</i>, not only refer to common animals like Labradors, but also refer to categories of animals that include less familiar dogs like Chihuahuas. Your baby saw some pictures of animals that they are more likely to have seen before (i.e., a golden retriever), while others were more unusual (i.e., a basset hound). We wonder if babies will recognize the atypical animals as quickly as the typical animals.</br></br>Babies know more about words than they are able to say, so we look at what babies <i>understand</i> about words by seeing what they look at during the study. There are many reasons why your baby might look to one kind of animal over another, and your baby likely looked at pictures differently than another child based on their unique experiences with these animals. For example, your baby may not know the word <i>fish</i> or maybe you have a golden retriever at home that looks like the one in our study.";

    try {
        // look for most recent condition
        var mostRecentSession = pastSessions.find(
            sess => Object.keys(sess.get('expData', {})).some(frId => frId.includes('trial')));
        console.log(mostRecentSession);
        if (mostRecentSession) {

            console.log(mostRecentSession.get('expData', {}));
            console.log(mostRecentSession.get('conditions'));
            console.log(Object.keys(mostRecentSession.get('conditions')));
            console.log(Object.keys(mostRecentSession.get('conditions'))[0]);
            console.log(Object.keys(mostRecentSession.get('conditions'))[0].slice(3));
            var most_recent_condition = Object.keys(mostRecentSession.get('conditions'))[0].slice(3);
            // If there is such a session, find out what condition they were in that time
            // and flip it
            if (most_recent_condition == "cond-1A") {
                //next condition assignment
                condition = "cond-1B"
            } else if (most_recent_condition == "cond-1B") {
                //next condition assignment
                condition = "cond-1A"
            } else if (most_recent_condition == "cond-2A") {
                //next condition assignment
                condition = "cond-2B"
            } else if (most_recent_condition == "cond-2B") {
                //next condition assignment
                condition = "cond-2A"
            } else if (most_recent_condition == "cond-1A-locationflip") {
                //next condition assignment
                condition = "cond-1B-locationflip"
            } else if (most_recent_condition == "cond-1B-locationflip") {
                //next condition assignment
                condition = "cond-1A-locationflip"
            } else if (most_recent_condition == "cond-2A-locationflip") {
                //next condition assignment
                condition = "cond-2B-locationflip"
            } else if (most_recent_condition == "cond-2B-locationflip") {
                //next condition assignment
                condition = "cond-2A-locationflip"
            }

            console.log(child.get('birthday').toISOString().substr(0, 10));
            console.log(child.get('givenName'));

            var url = "https://uwmadison.co1.qualtrics.com/jfe/form/SV_eR4px5bXGlt35xc";
            var url_id = url + "?givenName=" + String(child.get('givenName')) + "?birthday=" + String(child.get('birthday').toISOString().substr(0, 10)) + "?condition=" + String(condition);
            console.log(url_id)

            debrief_text = "In this study, we are interested in how babies learn that words, such as <i>dog</i>, not only refer to common animals like Labradors, but also refer to categories of animals that include less familiar dogs like Chihuahuas. Your baby saw some pictures of animals that they are more likely to have seen before (i.e., a golden retriever), while others were more unusual (i.e., a basset hound). We wonder if babies will recognize the atypical animals as quickly as the typical animals.</br></br>Babies know more about words than they are able to say, so we look at what babies <i>understand</i> about words by seeing what they look at during the study. There are many reasons why your baby might look to one kind of animal over another, and your baby likely looked at pictures differently than another child based on their unique experiences with these animals. For example, your baby may not know the word <i>fish</i> or maybe you have a golden retriever at home that looks like the one in our study. That’s totally okay! We average across many babies and many different trials to understand how babies, on average, learn that words refer to categories of things.</br></br>Once we have checked that your consent video meets our eligibility criteria, we will send you a $5 Amazon gift card (US) as a thank you! You can expect to receive the gift card within one week of participating.</br></br> <a href='" + url_id + "' target='_blank'>Click here to complete the questionnaire about your child's experience with animals</a>.</br></br>You can learn more about our research <a href='https://infantlearning.waisman.wisc.edu/' target='_blank' rel='noopener'>on the Infant Learning Lab website</a> or by checking us out in the First Words episode of <a href='https://www.netflix.com/title/80117833' target='_blank' rel='noopener'>Netflix’s Babies docuseries</a>. If you know other families who may want to do our study, please share this study on Facebook below.</br></br>Thank you!";
        }

    } catch (error) {
        // Just in case - wrap the above in a try block so we fall back to
        // random assignment if something is weird about the pastSessions data
        console.error(error);
    }

    console.log(condition);

    let frames = {
        "eligibility-survey": {
            "kind": "exp-lookit-survey",
            "formSchema": {
                "schema": {
                    "type": "object",
                    "title": "Eligibility survey </br></br> <img src='https://raw.githubusercontent.com/mzettersten/lwl_typ_animals/master/lookit_experiments/img/USAmap_450.png' alt='US map'  class='center'>",
                    "properties": {
                        "liveUS": {
                            "enum": [
                                "yes",
                                "no"
                            ],
                            "type": "string",
                            "title": "Do you (the grown-up) and your baby live in the United States of America (USA)?",
                            "required": true
                        }
                    }
                },
                "options": {
                    "fields": {
                        "liveUS": {
                            "type": "radio",
                            "message": "This question is required to be eligible for the study! Please answer this question.",
                            "validator": "required-field",
                            "sort": false
                        }
                    }
                }
            },
            "nextButtonText": "Continue",
            "showPreviousButton": false
        },
        "eligibility-procedure": {
            "kind": "exp-frame-select",
            "frameOptions": [{
                    "kind": "exp-lookit-text",
                    "blocks": [{
                            "emph": true,
                            "text": "Let's start the study!"
                        },
                        {
                            "text": "Press NEXT below to learn about the study and how to get set up to participate!"
                        }
                    ]
                },
                {
                    "kind": "exp-lookit-text",
                    "nextButtonText": " ",
                    "blocks": [{
                            "emph": true,
                            "text": "This study is only open to families in the United States."
                        },
                        {
                            "text": "Thank you so much for your interest in our study! Unfortunately, this study is only open to families in the United States due to difficulties with compensating families in other countries. In the future, we are hoping to change that since we are interested in the language development of babies all over the world!"
                        },
                        {
                            "text": "If you live outside of the United States, <a href='https://lookit.mit.edu/studies/'> please click here to exit and go back to the Lookit Studies page.</a> If you choose to participate in the study and you live outside of the United States, we won't be able to use your data or compensate you for your time. Thank you so much for understanding!"
                        }
                    ]
                }
            ],
            "generateProperties": "function(expData, sequence, child, pastSessions) {var formData = expData['0-eligibility-survey'].formData; if (formData.liveUS == 'yes') { console.log('eligible'); return { 'whichFrames': 0, 'ELIGIBLE': true } } else { console.log('ineligible'); return { 'whichFrames': 1,  'ELIGIBLE': false } } }",
            "commonFrameProperties": {
                "showPreviousButton": false
            }
        },
        "study-intro": {
            "kind": "exp-lookit-instruction-video",
            "instructionsVideo": [{
                "src": "https://raw.githubusercontent.com/mzettersten/lwl_typ_animals/master/lookit_experiments/mp4/introductionVideo1CC.mp4",
                "type": "video/mp4"
            }],
            "introText": "Welcome to the study! Please watch this video to get started. \n(Or you can read the summary to the right if you prefer.)",
            "transcriptTitle": "Video summary",
            "transcriptBlocks": [{
                    "title": "Background information about the study",
                    "listblocks": [{
                            "text": "Your baby does not need to be with you at this point in the study. We will let you know when it is time to get your baby."
                        },
                        {
                            "text": "Over the first two years of life, babies learn to link the words they hear with the objects they experience in their environment. Yet, words refer to entire categories of things in the world. In this study, We want to understand whether the words that babies know are limited to the kinds of examples they experience in their life or whether words are linked with both familiar and unfamiliar examples."
                        }
                    ]
                },
                {
                    "title": "Preview of what your baby will see"
                },
                {
                    "listblocks": [{
                        "text": "Your baby will be shown two animals on the screen; one on the left and one on the right. Then your baby will hear one of the animals named. Sometimes the animals shown will be the kinds of animals your baby may have seen before, and other times the animals will be less familiar. If babies look at the familiar and unfamiliar animals after hearing the animal's name, that means that they understand that words refer to entire categories of things. "
                    }]
                },
                {
                    "title": "What's next?",
                    "listblocks": [{
                            "text": "Because this is an online study, we will check to make sure that your webcam is set up and working properly on the next page, so we can record your baby’s looking behavior during the study."
                        },
                        {
                            "text": "Following that page, you will be given an opportunity to review the consent information and we will ask that you record a short video of yourself giving consent to participate in this study."
                        },
                        {
                            "text": "We will then give you detailed information about what to do during the study and how to position yourself and baby before starting the study. In total, you will have to advance through 5 pages before starting the study."
                        }
                    ]
                }
            ],
            "warningText": "Please watch the video or read the summary before proceeding.",
            "nextButtonText": "I'm ready to make sure my webcam is connected!",
            "title": "Study instructions",
            "showPreviousButton": false
        },
        "webcam-display": {
            "kind": "exp-lookit-webcam-display",
            "blocks": [{
                "title": "Let's check your web cam one last time!",
                "listblocks": [{
                        "text": "Check that you can see you and your child are easily visible"
                    },
                    {
                        "text": "Press the next button to begin the study"
                    }
                ]
            }],
            "nextButtonText": "Start the study!",
            "showPreviousButton": true,
            "displayFullscreenOverride": true,
            "startRecordingAutomatically": false
        },
        "exp-get-ready": {
            "kind": "exp-lookit-images-audio",
            "baseDir": "https://raw.githubusercontent.com/mzettersten/lwl_typ_animals/master/lookit_experiments/",
            "audio": "begin",
            "images": [{
                "id": "begin",
                "src": "calib_duck.png",
                "top": 30,
                "left": 40,
                "width": 20
            }],
            "autoProceed": true,
            "doRecording": false,
            "audioTypes": [
                "mp3",
                "ogg"
            ],
            "backgroundColor": "gray",
            "pageColor": "gray",
            "parentTextBlock": {
                "text": "Please close your eyes!",
                "title": "Get ready!"
            }

        },
        "video-config": {
            "kind": "exp-video-config",
            "troubleshootingIntro": "If you’re having any difficulties getting your webcam set up, please feel free to email the Infant Learning Lab at infantlearninglab@waisman.wisc.edu."
        },
        "exp-calibration": {
            "kind": "exp-lookit-calibration",
            "baseDir": "https://raw.githubusercontent.com/mzettersten/lwl_typ_animals/master/lookit_experiments/",
            "audioTypes": [
                "ogg",
                "mp3"
            ],
            "calibrationImage": "calib_duck.png",
            "calibrationLength": 3000,
            "calibrationPositions": [
                "center",
                "left",
                "right"
            ],
            "calibrationAudio": "pinwheel",
            "calibrationImageAnimation": "bounce",
            "doRecording": true,
            "backgroundColor": "gray",
            "showWaitForRecordingMessage": true,
            "showWaitForUploadingMessage": true,
            "waitForRecordingMessage": " ",
            "waitForUploadMessage": " ",
            "waitForRecordingMessageColor": "gray",
            "waitForUploadMessageColor": "gray"
        },
        "cond-1A": {
            "kind": "group",
            "frameList": [{
                    "id": "order1A-trial-1",
                    "audio": "see_1_silence_the_cat_see_3",
                    "images": [{
                            "id": "order1A-trial-1-left",
                            "src": "germanshepherd_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-1-right",
                            "src": "arabianmau_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-2",
                    "audio": "where_1_silence_the_bird_1",
                    "images": [{
                            "id": "order1A-trial-2-left",
                            "src": "cardinal_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-2-right",
                            "src": "clownfish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-3",
                    "audio": "find_1_silence_the_fish_4",
                    "images": [{
                            "id": "order1A-trial-3-left",
                            "src": "lionfish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-3-right",
                            "src": "oriental_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-4",
                    "audio": "look_1_silence_the_dog_1",
                    "images": [{
                            "id": "order1A-trial-4-left",
                            "src": "kingfisher_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-4-right",
                            "src": "afghanhound_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-5",
                    "audio": "acrossTheUniverse000",
                    "images": [{
                            "id": "order1A-trial-5-left",
                            "src": "balloons_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-5-right",
                            "src": "balloons_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-6",
                    "audio": "where_1_silence_the_dog_1",
                    "images": [{
                            "id": "order1A-trial-6-left",
                            "src": "sheepdog_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-6-right",
                            "src": "sphynx_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-7",
                    "audio": "see_1_silence_the_fish_see_2",
                    "images": [{
                            "id": "order1A-trial-7-left",
                            "src": "kookaburra_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-7-right",
                            "src": "betafish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-8",
                    "audio": "look_1_silence_the_bird_1",
                    "images": [{
                            "id": "order1A-trial-8-left",
                            "src": "tabby_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-8-right",
                            "src": "robin_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-9",
                    "audio": "find_1_silence_the_cat_1",
                    "images": [{
                            "id": "order1A-trial-9-left",
                            "src": "chartreux_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-9-right",
                            "src": "bass_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-10",
                    "audio": "yellow001",
                    "images": [{
                            "id": "order1A-trial-10-left",
                            "src": "beach_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-10-right",
                            "src": "beach_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-11",
                    "audio": "look_1_silence_the_fish_4",
                    "images": [{
                            "id": "order1A-trial-11-left",
                            "src": "bluegill_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-11-right",
                            "src": "goldenretriever_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-12",
                    "audio": "see_1_silence_the_dog_see_1",
                    "images": [{
                            "id": "order1A-trial-12-left",
                            "src": "sparrow_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-12-right",
                            "src": "beagle_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-13",
                    "audio": "where_1_silence_the_cat_1",
                    "images": [{
                            "id": "order1A-trial-13-left",
                            "src": "cornishrex_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-13-right",
                            "src": "heron_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-14",
                    "audio": "find_1_silence_the_bird_1",
                    "images": [{
                            "id": "order1A-trial-14-left",
                            "src": "betafish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-14-right",
                            "src": "kookaburra_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-15",
                    "audio": "acrossTheUniverse016",
                    "images": [{
                            "id": "order1A-trial-15-left",
                            "src": "fireworks_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-15-right",
                            "src": "fireworks_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-16",
                    "audio": "see_1_silence_the_bird_see_1",
                    "images": [{
                            "id": "order1A-trial-16-left",
                            "src": "kingfisher_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-16-right",
                            "src": "afghanhound_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-17",
                    "audio": "find_1_silence_the_dog_1",
                    "images": [{
                            "id": "order1A-trial-17-left",
                            "src": "germanshepherd_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-17-right",
                            "src": "arabianmau_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-18",
                    "audio": "where_1_silence_the_fish_4",
                    "images": [{
                            "id": "order1A-trial-18-left",
                            "src": "cardinal_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-18-right",
                            "src": "clownfish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-19",
                    "audio": "look_1_silence_the_cat_1",
                    "images": [{
                            "id": "order1A-trial-19-left",
                            "src": "lionfish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-19-right",
                            "src": "oriental_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-20",
                    "audio": "yellow001",
                    "images": [{
                            "id": "order1A-trial-20-left",
                            "src": "mountain_left_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-20-right",
                            "src": "mountain_right_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-21",
                    "audio": "find_1_silence_the_bird_1",
                    "images": [{
                            "id": "order1A-trial-21-left",
                            "src": "cornishrex_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-21-right",
                            "src": "heron_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-22",
                    "audio": "see_1_silence_the_cat_see_3",
                    "images": [{
                            "id": "order1A-trial-22-left",
                            "src": "robin_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-22-right",
                            "src": "tabby_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-23",
                    "audio": "look_1_silence_the_dog_1",
                    "images": [{
                            "id": "order1A-trial-23-left",
                            "src": "bassethound_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-23-right",
                            "src": "sturgeon_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-24",
                    "audio": "where_1_silence_the_fish_4",
                    "images": [{
                            "id": "order1A-trial-24-left",
                            "src": "bass_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-24-right",
                            "src": "chartreux_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-25",
                    "audio": "acrossTheUniverse000",
                    "images": [{
                            "id": "order1A-trial-25-left",
                            "src": "water_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-25-right",
                            "src": "water_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-26",
                    "audio": "where_1_silence_the_fish_4",
                    "images": [{
                            "id": "order1A-trial-26-left",
                            "src": "bassethound_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-26-right",
                            "src": "sturgeon_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-27",
                    "audio": "find_1_silence_the_cat_1",
                    "images": [{
                            "id": "order1A-trial-27-left",
                            "src": "sphynx_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-27-right",
                            "src": "sheepdog_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-28",
                    "audio": "look_1_silence_the_dog_1",
                    "images": [{
                            "id": "order1A-trial-28-left",
                            "src": "bluegill_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-28-right",
                            "src": "goldenretriever_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-trial-29",
                    "audio": "see_1_silence_the_bird_see_1",
                    "images": [{
                            "id": "order1A-trial-29-left",
                            "src": "sparrow_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-trial-29-right",
                            "src": "beagle_600x600.jpg",
                            "position": "right"
                        }
                    ]
                }, {
                    "id": "order1A-trial-30",
                    "audio": "done",
                    "doRecording": false,
                    "images": [{
                        "id": "order1A-trial-30-end",
                        "src": "endPhoto.jpg",
                        "position": "fill"
                    }]
                }
            ],
            "commonFrameProperties": {
                "kind": "exp-lookit-images-audio",
                "baseDir": "https://raw.githubusercontent.com/mzettersten/lwl_typ_animals/master/lookit_experiments/",
                "pageColor": "gray",
                "maximizesDisplay": true,
                "durationSeconds": 7.2,
                "doRecording": true,
                "showWaitForRecordingMessage": true,
                "showWaitForUploadingMessage": true,
                "waitForRecordingMessage": " ",
                "waitForUploadMessage": " ",
                "waitForRecordingMessageColor": "gray",
                "waitForUploadMessageColor": "gray",
                "maxUploadSeconds": 10,
                "audioTypes": [
                    "mp3",
                    "ogg"
                ],
                "videoTypes": [
                    "mp4",
                    "webm"
                ],
                "autoProceed": true,
                "backgroundColor": "gray",
                "announcementLength": 0,
                "pauseWhenExitingFullscreen": true,
                "allowUserPause": true,
                "frameOffsetAfterPause": 1,
                "pausedText": "The study is paused. \n\n Please reposition your baby and press the space bar to continue. \n\n If you would like to end the study press crl-X or F1."
            }
        },
        "cond-1B": {
            "kind": "group",
            "frameList": [{
                    "id": "order1B-trial-1",
                    "audio": "see_1_silence_the_bird_see_1",
                    "images": [{
                            "id": "order1B-trial-1-left",
                            "src": "beagle_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-1-right",
                            "src": "sparrow_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-2",
                    "audio": "look_1_silence_the_dog_1",
                    "images": [{
                            "id": "order1B-trial-2-left",
                            "src": "goldenretriever_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-2-right",
                            "src": "bluegill_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-3",
                    "audio": "find_1_silence_the_cat_1",
                    "images": [{
                            "id": "order1B-trial-3-left",
                            "src": "sheepdog_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-3-right",
                            "src": "sphynx_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-4",
                    "audio": "where_1_silence_the_fish_4",
                    "images": [{
                            "id": "order1B-trial-4-left",
                            "src": "sturgeon_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-4-right",
                            "src": "bassethound_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-5",
                    "audio": "acrossTheUniverse000",
                    "images": [{
                            "id": "order1B-trial-5-left",
                            "src": "water_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-5-right",
                            "src": "water_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-6",
                    "audio": "where_1_silence_the_fish_4",
                    "images": [{
                            "id": "order1B-trial-6-left",
                            "src": "chartreux_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-6-right",
                            "src": "bass_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-7",
                    "audio": "look_1_silence_the_dog_1",
                    "images": [{
                            "id": "order1B-trial-7-left",
                            "src": "sturgeon_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-7-right",
                            "src": "bassethound_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-8",
                    "audio": "see_1_silence_the_cat_see_3",
                    "images": [{
                            "id": "order1B-trial-8-left",
                            "src": "tabby_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-8-right",
                            "src": "robin_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-9",
                    "audio": "find_1_silence_the_bird_1",
                    "images": [{
                            "id": "order1B-trial-9-left",
                            "src": "heron_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-9-right",
                            "src": "cornishrex_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-10",
                    "audio": "yellow001",
                    "images": [{
                            "id": "order1B-trial-10-left",
                            "src": "mountain_left_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-10-right",
                            "src": "mountain_right_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-11",
                    "audio": "look_1_silence_the_cat_1",
                    "images": [{
                            "id": "order1B-trial-11-left",
                            "src": "oriental_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-11-right",
                            "src": "lionfish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-12",
                    "audio": "where_1_silence_the_fish_4",
                    "images": [{
                            "id": "order1B-trial-12-left",
                            "src": "clownfish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-12-right",
                            "src": "cardinal_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-13",
                    "audio": "find_1_silence_the_dog_1",
                    "images": [{
                            "id": "order1B-trial-13-left",
                            "src": "arabianmau_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-13-right",
                            "src": "germanshepherd_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-14",
                    "audio": "see_1_silence_the_bird_see_1",
                    "images": [{
                            "id": "order1B-trial-14-left",
                            "src": "afghanhound_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-14-right",
                            "src": "kingfisher_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-15",
                    "audio": "acrossTheUniverse016",
                    "images": [{
                            "id": "order1B-trial-15-left",
                            "src": "fireworks_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-15-right",
                            "src": "fireworks_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-16",
                    "audio": "find_1_silence_the_bird_1",
                    "images": [{
                            "id": "order1B-trial-16-left",
                            "src": "kookaburra_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-16-right",
                            "src": "betafish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-17",
                    "audio": "where_1_silence_the_cat_1",
                    "images": [{
                            "id": "order1B-trial-17-left",
                            "src": "heron_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-17-right",
                            "src": "cornishrex_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-18",
                    "audio": "see_1_silence_the_dog_see_1",
                    "images": [{
                            "id": "order1B-trial-18-left",
                            "src": "beagle_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-18-right",
                            "src": "sparrow_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-19",
                    "audio": "look_1_silence_the_fish_4",
                    "images": [{
                            "id": "order1B-trial-19-left",
                            "src": "goldenretriever_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-19-right",
                            "src": "bluegill_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-20",
                    "audio": "yellow001",
                    "images": [{
                            "id": "order1B-trial-20-left",
                            "src": "beach_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-20-right",
                            "src": "beach_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-21",
                    "audio": "find_1_silence_the_cat_1",
                    "images": [{
                            "id": "order1B-trial-21-left",
                            "src": "bass_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-21-right",
                            "src": "chartreux_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-22",
                    "audio": "look_1_silence_the_bird_1",
                    "images": [{
                            "id": "order1B-trial-22-left",
                            "src": "robin_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-22-right",
                            "src": "tabby_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-23",
                    "audio": "see_1_silence_the_fish_see_2",
                    "images": [{
                            "id": "order1B-trial-23-left",
                            "src": "betafish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-23-right",
                            "src": "kookaburra_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-24",
                    "audio": "where_1_silence_the_dog_1",
                    "images": [{
                            "id": "order1B-trial-24-left",
                            "src": "sphynx_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-24-right",
                            "src": "sheepdog_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-25",
                    "audio": "acrossTheUniverse000",
                    "images": [{
                            "id": "order1B-trial-25-left",
                            "src": "balloons_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-25-right",
                            "src": "balloons_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-26",
                    "audio": "look_1_silence_the_dog_1",
                    "images": [{
                            "id": "order1B-trial-26-left",
                            "src": "afghanhound_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-26-right",
                            "src": "kingfisher_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-27",
                    "audio": "find_1_silence_the_fish_4",
                    "images": [{
                            "id": "order1B-trial-27-left",
                            "src": "oriental_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-27-right",
                            "src": "lionfish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-28",
                    "audio": "where_1_silence_the_bird_1",
                    "images": [{
                            "id": "order1B-trial-28-left",
                            "src": "clownfish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-28-right",
                            "src": "cardinal_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-29",
                    "audio": "see_1_silence_the_cat_see_3",
                    "images": [{
                            "id": "order1B-trial-29-left",
                            "src": "arabianmau_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-trial-29-right",
                            "src": "germanshepherd_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-trial-30",
                    "audio": "done",
                    "doRecording": false,
                    "images": [{
                        "id": "order1B-trial-30-end",
                        "src": "endPhoto.jpg",
                        "position": "fill"
                    }]
                }
            ],
            "commonFrameProperties": {
                "kind": "exp-lookit-images-audio",
                "baseDir": "https://raw.githubusercontent.com/mzettersten/lwl_typ_animals/master/lookit_experiments/",
                "pageColor": "gray",
                "maximizesDisplay": true,
                "durationSeconds": 7.2,
                "doRecording": true,
                "showWaitForRecordingMessage": true,
                "showWaitForUploadingMessage": true,
                "waitForRecordingMessage": " ",
                "waitForUploadMessage": " ",
                "waitForRecordingMessageColor": "gray",
                "waitForUploadMessageColor": "gray",
                "maxUploadSeconds": 10,
                "audioTypes": [
                    "mp3",
                    "ogg"
                ],
                "videoTypes": [
                    "mp4",
                    "webm"
                ],
                "autoProceed": true,
                "backgroundColor": "gray",
                "announcementLength": 0,
                "pauseWhenExitingFullscreen": true,
                "allowUserPause": true,
                "frameOffsetAfterPause": 1,
                "pausedText": "The study is paused. \n\n Please reposition your baby and press the space bar to continue. \n\n If you would like to end the study press crl-X or F1."
            }
        },
        "cond-2A": {
            "kind": "group",
            "frameList": [{
                    "id": "order2A-trial-1",
                    "audio": "look_1_silence_the_bird_1",
                    "images": [{
                            "id": "order2A-trial-1-left",
                            "src": "arabianmau_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-1-right",
                            "src": "sparrow_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-2",
                    "audio": "see_1_silence_the_dog_see_1",
                    "images": [{
                            "id": "order2A-trial-2-left",
                            "src": "germanshepherd_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-2-right",
                            "src": "cardinal_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-3",
                    "audio": "where_1_silence_the_cat_1",
                    "images": [{
                            "id": "order2A-trial-3-left",
                            "src": "kookaburra_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-3-right",
                            "src": "oriental_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-4",
                    "audio": "find_1_silence_the_fish_4",
                    "images": [{
                            "id": "order2A-trial-4-left",
                            "src": "lionfish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-4-right",
                            "src": "kingfisher_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-5",
                    "audio": "acrossTheUniverse000",
                    "images": [{
                            "id": "order2A-trial-5-left",
                            "src": "balloons_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-5-right",
                            "src": "balloons_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-6",
                    "audio": "see_1_silence_the_dog_see_1",
                    "images": [{
                            "id": "order2A-trial-6-left",
                            "src": "bassethound_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-6-right",
                            "src": "heron_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-7",
                    "audio": "find_1_silence_the_bird_1",
                    "images": [{
                            "id": "order2A-trial-7-left",
                            "src": "robin_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-7-right",
                            "src": "bluegill_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-8",
                    "audio": "where_1_silence_the_cat_1",
                    "images": [{
                            "id": "order2A-trial-8-left",
                            "src": "goldenretriever_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-8-right",
                            "src": "chartreux_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-9",
                    "audio": "look_1_silence_the_fish_4",
                    "images": [{
                            "id": "order2A-trial-9-left",
                            "src": "sphynx_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-9-right",
                            "src": "sturgeon_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-10",
                    "audio": "yellow001",
                    "images": [{
                            "id": "order2A-trial-10-left",
                            "src": "beach_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-10-right",
                            "src": "beach_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-11",
                    "audio": "where_1_silence_the_bird_1",
                    "images": [{
                            "id": "order2A-trial-11-left",
                            "src": "kingfisher_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-11-right",
                            "src": "lionfish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-12",
                    "audio": "see_1_silence_the_cat_see_3",
                    "images": [{
                            "id": "order2A-trial-12-left",
                            "src": "afghanhound_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-12-right",
                            "src": "cornishrex_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-13",
                    "audio": "find_1_silence_the_fish_4",
                    "images": [{
                            "id": "order2A-trial-13-left",
                            "src": "clownfish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-13-right",
                            "src": "tabby_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-14",
                    "audio": "look_1_silence_the_dog_1",
                    "images": [{
                            "id": "order2A-trial-14-left",
                            "src": "bass_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-14-right",
                            "src": "beagle_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-15",
                    "audio": "acrossTheUniverse016",
                    "images": [{
                            "id": "order2A-trial-15-left",
                            "src": "fireworks_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-15-right",
                            "src": "fireworks_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-16",
                    "audio": "find_1_silence_the_dog_1",
                    "images": [{
                            "id": "order2A-trial-16-left",
                            "src": "cornishrex_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-16-right",
                            "src": "afghanhound_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-17",
                    "audio": "where_1_silence_the_fish_4",
                    "images": [{
                            "id": "order2A-trial-17-left",
                            "src": "betafish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-17-right",
                            "src": "sheepdog_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-18",
                    "audio": "see_1_silence_the_bird_see_1",
                    "images": [{
                            "id": "order2A-trial-18-left",
                            "src": "germanshepherd_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-18-right",
                            "src": "cardinal_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-19",
                    "audio": "look_1_silence_the_cat_1",
                    "images": [{
                            "id": "order2A-trial-19-left",
                            "src": "arabianmau_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-19-right",
                            "src": "sparrow_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-20",
                    "audio": "yellow001",
                    "images": [{
                            "id": "order2A-trial-20-left",
                            "src": "mountain_left_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-20-right",
                            "src": "mountain_right_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-21",
                    "audio": "where_1_silence_the_cat_1",
                    "images": [{
                            "id": "order2A-trial-21-left",
                            "src": "tabby_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-21-right",
                            "src": "clownfish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-22",
                    "audio": "find_1_silence_the_dog_1",
                    "images": [{
                            "id": "order2A-trial-22-left",
                            "src": "betafish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-22-right",
                            "src": "sheepdog_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-23",
                    "audio": "see_1_silence_the_fish_see_2",
                    "images": [{
                            "id": "order2A-trial-23-left",
                            "src": "beagle_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-23-right",
                            "src": "bass_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-24",
                    "audio": "look_1_silence_the_bird_1",
                    "images": [{
                            "id": "order2A-trial-24-left",
                            "src": "kookaburra_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-24-right",
                            "src": "oriental_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-25",
                    "audio": "acrossTheUniverse000",
                    "images": [{
                            "id": "order2A-trial-25-left",
                            "src": "water_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-25-right",
                            "src": "water_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-26",
                    "audio": "see_1_silence_the_fish_see_2",
                    "images": [{
                            "id": "order2A-trial-26-left",
                            "src": "robin_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-26-right",
                            "src": "bluegill_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-27",
                    "audio": "find_1_silence_the_cat_1",
                    "images": [{
                            "id": "order2A-trial-27-left",
                            "src": "sphynx_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-27-right",
                            "src": "sturgeon_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-28",
                    "audio": "where_1_silence_the_dog_1",
                    "images": [{
                            "id": "order2A-trial-28-left",
                            "src": "goldenretriever_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-28-right",
                            "src": "chartreux_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-29",
                    "audio": "look_1_silence_the_bird_1",
                    "images": [{
                            "id": "order2A-trial-29-left",
                            "src": "bassethound_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-trial-29-right",
                            "src": "heron_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-trial-30",
                    "audio": "done",
                    "doRecording": false,
                    "images": [{
                        "id": "order2A-trial-30-end",
                        "src": "endPhoto.jpg",
                        "position": "fill"
                    }]
                }
            ],
            "commonFrameProperties": {
                "kind": "exp-lookit-images-audio",
                "baseDir": "https://raw.githubusercontent.com/mzettersten/lwl_typ_animals/master/lookit_experiments/",
                "pageColor": "gray",
                "maximizesDisplay": true,
                "durationSeconds": 7.2,
                "doRecording": true,
                "showWaitForRecordingMessage": true,
                "showWaitForUploadingMessage": true,
                "waitForRecordingMessage": " ",
                "waitForUploadMessage": " ",
                "waitForRecordingMessageColor": "gray",
                "waitForUploadMessageColor": "gray",
                "maxUploadSeconds": 10,
                "audioTypes": [
                    "mp3",
                    "ogg"
                ],
                "videoTypes": [
                    "mp4",
                    "webm"
                ],
                "autoProceed": true,
                "backgroundColor": "gray",
                "announcementLength": 0,
                "pauseWhenExitingFullscreen": true,
                "allowUserPause": true,
                "frameOffsetAfterPause": 1,
                "pausedText": "The study is paused. \n\n Please reposition your baby and press the space bar to continue. \n\n If you would like to end the study press crl-X or F1."
            }
        },
        "cond-2B": {
            "kind": "group",
            "frameList": [{
                    "id": "order2B-trial-1",
                    "audio": "look_1_silence_the_bird_1",
                    "images": [{
                            "id": "order2B-trial-1-left",
                            "src": "heron_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-1-right",
                            "src": "bassethound_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-2",
                    "audio": "where_1_silence_the_dog_1",
                    "images": [{
                            "id": "order2B-trial-2-left",
                            "src": "chartreux_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-2-right",
                            "src": "goldenretriever_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-3",
                    "audio": "find_1_silence_the_cat_1",
                    "images": [{
                            "id": "order2B-trial-3-left",
                            "src": "sturgeon_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-3-right",
                            "src": "sphynx_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-4",
                    "audio": "see_1_silence_the_fish_see_2",
                    "images": [{
                            "id": "order2B-trial-4-left",
                            "src": "bluegill_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-4-right",
                            "src": "robin_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-5",
                    "audio": "acrossTheUniverse000",
                    "images": [{
                            "id": "order2B-trial-5-left",
                            "src": "water_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-5-right",
                            "src": "water_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-6",
                    "audio": "look_1_silence_the_bird_1",
                    "images": [{
                            "id": "order2B-trial-6-left",
                            "src": "oriental_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-6-right",
                            "src": "kookaburra_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-7",
                    "audio": "see_1_silence_the_fish_see_2",
                    "images": [{
                            "id": "order2B-trial-7-left",
                            "src": "bass_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-7-right",
                            "src": "beagle_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-8",
                    "audio": "find_1_silence_the_dog_1",
                    "images": [{
                            "id": "order2B-trial-8-left",
                            "src": "sheepdog_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-8-right",
                            "src": "betafish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-9",
                    "audio": "where_1_silence_the_cat_1",
                    "images": [{
                            "id": "order2B-trial-9-left",
                            "src": "clownfish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-9-right",
                            "src": "tabby_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-10",
                    "audio": "yellow001",
                    "images": [{
                            "id": "order2B-trial-10-left",
                            "src": "mountain_left_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-10-right",
                            "src": "mountain_righ_600x600t.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-11",
                    "audio": "look_1_silence_the_cat_1",
                    "images": [{
                            "id": "order2B-trial-11-left",
                            "src": "sparrow_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-11-right",
                            "src": "arabianmau_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-12",
                    "audio": "see_1_silence_the_bird_see_1",
                    "images": [{
                            "id": "order2B-trial-12-left",
                            "src": "cardinal_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-12-right",
                            "src": "germanshepherd_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-13",
                    "audio": "where_1_silence_the_fish_4",
                    "images": [{
                            "id": "order2B-trial-13-left",
                            "src": "sheepdog_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-13-right",
                            "src": "betafish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-14",
                    "audio": "find_1_silence_the_dog_1",
                    "images": [{
                            "id": "order2B-trial-14-left",
                            "src": "afghanhound_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-14-right",
                            "src": "cornishrex_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-15",
                    "audio": "acrossTheUniverse016",
                    "images": [{
                            "id": "order2B-trial-15-left",
                            "src": "fireworks_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-15-right",
                            "src": "fireworks_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-16",
                    "audio": "look_1_silence_the_dog_1",
                    "images": [{
                            "id": "order2B-trial-16-left",
                            "src": "beagle_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-16-right",
                            "src": "bass_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-17",
                    "audio": "find_1_silence_the_fish_4",
                    "images": [{
                            "id": "order2B-trial-17-left",
                            "src": "tabby_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-17-right",
                            "src": "clownfish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-18",
                    "audio": "see_1_silence_the_cat_see_3",
                    "images": [{
                            "id": "order2B-trial-18-left",
                            "src": "cornishrex_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-18-right",
                            "src": "afghanhound_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-19",
                    "audio": "where_1_silence_the_bird_1",
                    "images": [{
                            "id": "order2B-trial-19-left",
                            "src": "lionfish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-19-right",
                            "src": "kingfisher_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-20",
                    "audio": "yellow001",
                    "images": [{
                            "id": "order2B-trial-20-left",
                            "src": "beach_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-20-right",
                            "src": "beach_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-21",
                    "audio": "look_1_silence_the_fish_4",
                    "images": [{
                            "id": "order2B-trial-21-left",
                            "src": "sturgeon_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-21-right",
                            "src": "sphynx_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-22",
                    "audio": "where_1_silence_the_cat_1",
                    "images": [{
                            "id": "order2B-trial-22-left",
                            "src": "chartreux_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-22-right",
                            "src": "goldenretriever_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-23",
                    "audio": "find_1_silence_the_bird_1",
                    "images": [{
                            "id": "order2B-trial-23-left",
                            "src": "bluegill_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-23-right",
                            "src": "robin_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-24",
                    "audio": "see_1_silence_the_dog_see_1",
                    "images": [{
                            "id": "order2B-trial-24-left",
                            "src": "heron_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-24-right",
                            "src": "bassethound_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-25",
                    "audio": "acrossTheUniverse000",
                    "images": [{
                            "id": "order2B-trial-25-left",
                            "src": "balloons_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-25-right",
                            "src": "balloons_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-26",
                    "audio": "find_1_silence_the_fish_4",
                    "images": [{
                            "id": "order2B-trial-26-left",
                            "src": "kingfisher_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-26-right",
                            "src": "lionfish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-27",
                    "audio": "where_1_silence_the_cat_1",
                    "images": [{
                            "id": "order2B-trial-27-left",
                            "src": "oriental_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-27-right",
                            "src": "kookaburra_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-28",
                    "audio": "see_1_silence_the_dog_see_1",
                    "images": [{
                            "id": "order2B-trial-28-left",
                            "src": "cardinal_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-28-right",
                            "src": "germanshepherd_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-29",
                    "audio": "look_1_silence_the_bird_1",
                    "images": [{
                            "id": "order2B-trial-29-left",
                            "src": "sparrow_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-trial-29-right",
                            "src": "arabianmau_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-trial-30",
                    "audio": "done",
                    "doRecording": false,
                    "images": [{
                        "id": "order2B-trial-30-end",
                        "src": "endPhoto.jpg",
                        "position": "fill"
                    }]
                }
            ],
            "commonFrameProperties": {
                "kind": "exp-lookit-images-audio",
                "baseDir": "https://raw.githubusercontent.com/mzettersten/lwl_typ_animals/master/lookit_experiments/",
                "pageColor": "gray",
                "maximizesDisplay": true,
                "durationSeconds": 7.2,
                "doRecording": true,
                "showWaitForRecordingMessage": true,
                "showWaitForUploadingMessage": true,
                "waitForRecordingMessage": " ",
                "waitForUploadMessage": " ",
                "waitForRecordingMessageColor": "gray",
                "waitForUploadMessageColor": "gray",
                "maxUploadSeconds": 10,
                "audioTypes": [
                    "mp3",
                    "ogg"
                ],
                "videoTypes": [
                    "mp4",
                    "webm"
                ],
                "autoProceed": true,
                "backgroundColor": "gray",
                "announcementLength": 0,
                "pauseWhenExitingFullscreen": true,
                "allowUserPause": true,
                "frameOffsetAfterPause": 1,
                "pausedText": "The study is paused. \n\n Please reposition your baby and press the space bar to continue. \n\n If you would like to end the study press crl-X or F1."
            }
        },
        "cond-1A-locationflip": {
            "kind": "group",
            "frameList": [{
                    "id": "order1A-locationflip-trial-1",
                    "audio": "see_1_silence_the_cat_see_3",
                    "images": [{
                            "id": "order1A-locationflip-trial-1-left",
                            "src": "arabianmau_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-1-right",
                            "src": "germanshepherd_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-2",
                    "audio": "where_1_silence_the_bird_1",
                    "images": [{
                            "id": "order1A-locationflip-trial-2-left",
                            "src": "clownfish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-2-right",
                            "src": "cardinal_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-3",
                    "audio": "find_1_silence_the_fish_4",
                    "images": [{
                            "id": "order1A-locationflip-trial-3-left",
                            "src": "oriental_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-3-right",
                            "src": "lionfish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-4",
                    "audio": "look_1_silence_the_dog_1",
                    "images": [{
                            "id": "order1A-locationflip-trial-4-left",
                            "src": "afghanhound_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-4-right",
                            "src": "kingfisher_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-5",
                    "audio": "acrossTheUniverse000",
                    "images": [{
                            "id": "order1A-locationflip-trial-5-left",
                            "src": "balloons_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-5-right",
                            "src": "balloons_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-6",
                    "audio": "where_1_silence_the_dog_1",
                    "images": [{
                            "id": "order1A-locationflip-trial-6-left",
                            "src": "sphynx_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-6-right",
                            "src": "sheepdog_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-7",
                    "audio": "see_1_silence_the_fish_see_2",
                    "images": [{
                            "id": "order1A-locationflip-trial-7-left",
                            "src": "betafish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-7-right",
                            "src": "kookaburra_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-8",
                    "audio": "look_1_silence_the_bird_1",
                    "images": [{
                            "id": "order1A-locationflip-trial-8-left",
                            "src": "robin_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-8-right",
                            "src": "tabby_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-9",
                    "audio": "find_1_silence_the_cat_1",
                    "images": [{
                            "id": "order1A-locationflip-trial-9-left",
                            "src": "bass_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-9-right",
                            "src": "chartreux_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-10",
                    "audio": "yellow001",
                    "images": [{
                            "id": "order1A-locationflip-trial-10-left",
                            "src": "beach_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-10-right",
                            "src": "beach_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-11",
                    "audio": "look_1_silence_the_fish_4",
                    "images": [{
                            "id": "order1A-locationflip-trial-11-left",
                            "src": "goldenretriever_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-11-right",
                            "src": "bluegill_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-12",
                    "audio": "see_1_silence_the_dog_see_1",
                    "images": [{
                            "id": "order1A-locationflip-trial-12-left",
                            "src": "beagle_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-12-right",
                            "src": "sparrow_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-13",
                    "audio": "where_1_silence_the_cat_1",
                    "images": [{
                            "id": "order1A-locationflip-trial-13-left",
                            "src": "heron_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-13-right",
                            "src": "cornishrex_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-14",
                    "audio": "find_1_silence_the_bird_1",
                    "images": [{
                            "id": "order1A-locationflip-trial-14-left",
                            "src": "kookaburra_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-14-right",
                            "src": "betafish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-15",
                    "audio": "acrossTheUniverse016",
                    "images": [{
                            "id": "order1A-locationflip-trial-15-left",
                            "src": "fireworks_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-15-right",
                            "src": "fireworks_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-16",
                    "audio": "see_1_silence_the_bird_see_1",
                    "images": [{
                            "id": "order1A-locationflip-trial-16-left",
                            "src": "afghanhound_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-16-right",
                            "src": "kingfisher_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-17",
                    "audio": "find_1_silence_the_dog_1",
                    "images": [{
                            "id": "order1A-locationflip-trial-17-left",
                            "src": "arabianmau_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-17-right",
                            "src": "germanshepherd_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-18",
                    "audio": "where_1_silence_the_fish_4",
                    "images": [{
                            "id": "order1A-locationflip-trial-18-left",
                            "src": "clownfish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-18-right",
                            "src": "cardinal_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-19",
                    "audio": "look_1_silence_the_cat_1",
                    "images": [{
                            "id": "order1A-locationflip-trial-19-left",
                            "src": "oriental_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-19-right",
                            "src": "lionfish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-20",
                    "audio": "yellow001",
                    "images": [{
                            "id": "order1A-locationflip-trial-20-left",
                            "src": "mountain_left_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-20-right",
                            "src": "mountain_right_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-21",
                    "audio": "find_1_silence_the_bird_1",
                    "images": [{
                            "id": "order1A-locationflip-trial-21-left",
                            "src": "heron_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-21-right",
                            "src": "cornishrex_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-22",
                    "audio": "see_1_silence_the_cat_see_3",
                    "images": [{
                            "id": "order1A-locationflip-trial-22-left",
                            "src": "tabby_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-22-right",
                            "src": "robin_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-23",
                    "audio": "look_1_silence_the_dog_1",
                    "images": [{
                            "id": "order1A-locationflip-trial-23-left",
                            "src": "sturgeon_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-23-right",
                            "src": "bassethound_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-24",
                    "audio": "where_1_silence_the_fish_4",
                    "images": [{
                            "id": "order1A-locationflip-trial-24-left",
                            "src": "chartreux_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-24-right",
                            "src": "bass_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-25",
                    "audio": "acrossTheUniverse000",
                    "images": [{
                            "id": "order1A-locationflip-trial-25-left",
                            "src": "water_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-25-right",
                            "src": "water_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-26",
                    "audio": "where_1_silence_the_fish_4",
                    "images": [{
                            "id": "order1A-locationflip-trial-26-left",
                            "src": "sturgeon_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-26-right",
                            "src": "bassethound_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-27",
                    "audio": "find_1_silence_the_cat_1",
                    "images": [{
                            "id": "order1A-locationflip-trial-27-left",
                            "src": "sheepdog_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-27-right",
                            "src": "sphynx_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-28",
                    "audio": "look_1_silence_the_dog_1",
                    "images": [{
                            "id": "order1A-locationflip-trial-28-left",
                            "src": "goldenretriever_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-28-right",
                            "src": "bluegill_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-29",
                    "audio": "see_1_silence_the_bird_see_1",
                    "images": [{
                            "id": "order1A-locationflip-trial-29-left",
                            "src": "beagle_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1A-locationflip-trial-29-right",
                            "src": "sparrow_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1A-locationflip-trial-30",
                    "audio": "done",
                    "doRecording": false,
                    "images": [{
                        "id": "order1A-locationflip-trial-30-end",
                        "src": "endPhoto.jpg",
                        "position": "fill"
                    }]
                }
            ],
            "commonFrameProperties": {
                "kind": "exp-lookit-images-audio",
                "baseDir": "https://raw.githubusercontent.com/mzettersten/lwl_typ_animals/master/lookit_experiments/",
                "pageColor": "gray",
                "maximizesDisplay": true,
                "durationSeconds": 7.2,
                "doRecording": true,
                "showWaitForRecordingMessage": true,
                "showWaitForUploadingMessage": true,
                "waitForRecordingMessage": " ",
                "waitForUploadMessage": " ",
                "waitForRecordingMessageColor": "gray",
                "waitForUploadMessageColor": "gray",
                "maxUploadSeconds": 10,
                "audioTypes": [
                    "mp3",
                    "ogg"
                ],
                "videoTypes": [
                    "mp4",
                    "webm"
                ],
                "autoProceed": true,
                "backgroundColor": "gray",
                "announcementLength": 0,
                "pauseWhenExitingFullscreen": true,
                "allowUserPause": true,
                "frameOffsetAfterPause": 1,
                "pausedText": "The study is paused. \n\n Please reposition your baby and press the space bar to continue. \n\n If you would like to end the study press crl-X or F1."
            }
        },
        "cond-1B-locationflip": {
            "kind": "group",
            "frameList": [{
                    "id": "order1B-locationflip-trial-1",
                    "audio": "see_1_silence_the_bird_see_1",
                    "images": [{
                            "id": "order1B-locationflip-trial-1-left",
                            "src": "sparrow_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-1-right",
                            "src": "beagle_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-2",
                    "audio": "look_1_silence_the_dog_1",
                    "images": [{
                            "id": "order1B-locationflip-trial-2-left",
                            "src": "bluegill_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-2-right",
                            "src": "goldenretriever_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-3",
                    "audio": "find_1_silence_the_cat_1",
                    "images": [{
                            "id": "order1B-locationflip-trial-3-left",
                            "src": "sphynx_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-3-right",
                            "src": "sheepdog_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-4",
                    "audio": "where_1_silence_the_fish_4",
                    "images": [{
                            "id": "order1B-locationflip-trial-4-left",
                            "src": "bassethound_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-4-right",
                            "src": "sturgeon_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-5",
                    "audio": "acrossTheUniverse000",
                    "images": [{
                            "id": "order1B-locationflip-trial-5-left",
                            "src": "water_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-5-right",
                            "src": "water_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-6",
                    "audio": "where_1_silence_the_fish_4",
                    "images": [{
                            "id": "order1B-locationflip-trial-6-left",
                            "src": "bass_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-6-right",
                            "src": "chartreux_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-7",
                    "audio": "look_1_silence_the_dog_1",
                    "images": [{
                            "id": "order1B-locationflip-trial-7-left",
                            "src": "bassethound_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-7-right",
                            "src": "sturgeon_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-8",
                    "audio": "see_1_silence_the_cat_see_3",
                    "images": [{
                            "id": "order1B-locationflip-trial-8-left",
                            "src": "robin_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-8-right",
                            "src": "tabby_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-9",
                    "audio": "find_1_silence_the_bird_1",
                    "images": [{
                            "id": "order1B-locationflip-trial-9-left",
                            "src": "cornishrex_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-9-right",
                            "src": "heron_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-10",
                    "audio": "yellow001",
                    "images": [{
                            "id": "order1B-locationflip-trial-10-left",
                            "src": "mountain_left_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-10-right",
                            "src": "mountain_right_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-11",
                    "audio": "look_1_silence_the_cat_1",
                    "images": [{
                            "id": "order1B-locationflip-trial-11-left",
                            "src": "lionfish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-11-right",
                            "src": "oriental_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-12",
                    "audio": "where_1_silence_the_fish_4",
                    "images": [{
                            "id": "order1B-locationflip-trial-12-left",
                            "src": "cardinal_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-12-right",
                            "src": "clownfish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-13",
                    "audio": "find_1_silence_the_dog_1",
                    "images": [{
                            "id": "order1B-locationflip-trial-13-left",
                            "src": "germanshepherd_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-13-right",
                            "src": "arabianmau_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-14",
                    "audio": "see_1_silence_the_bird_see_1",
                    "images": [{
                            "id": "order1B-locationflip-trial-14-left",
                            "src": "kingfisher_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-14-right",
                            "src": "afghanhound_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-15",
                    "audio": "acrossTheUniverse016",
                    "images": [{
                            "id": "order1B-locationflip-trial-15-left",
                            "src": "fireworks_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-15-right",
                            "src": "fireworks_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-16",
                    "audio": "find_1_silence_the_bird_1",
                    "images": [{
                            "id": "order1B-locationflip-trial-16-left",
                            "src": "betafish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-16-right",
                            "src": "kookaburra_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-17",
                    "audio": "where_1_silence_the_cat_1",
                    "images": [{
                            "id": "order1B-locationflip-trial-17-left",
                            "src": "cornishrex_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-17-right",
                            "src": "heron_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-18",
                    "audio": "see_1_silence_the_dog_see_1",
                    "images": [{
                            "id": "order1B-locationflip-trial-18-left",
                            "src": "sparrow_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-18-right",
                            "src": "beagle_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-19",
                    "audio": "look_1_silence_the_fish_4",
                    "images": [{
                            "id": "order1B-locationflip-trial-19-left",
                            "src": "bluegill_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-19-right",
                            "src": "goldenretriever_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-20",
                    "audio": "yellow001",
                    "images": [{
                            "id": "order1B-locationflip-trial-20-left",
                            "src": "beach_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-20-right",
                            "src": "beach_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-21",
                    "audio": "find_1_silence_the_cat_1",
                    "images": [{
                            "id": "order1B-locationflip-trial-21-left",
                            "src": "chartreux_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-21-right",
                            "src": "bass_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-22",
                    "audio": "look_1_silence_the_bird_1",
                    "images": [{
                            "id": "order1B-locationflip-trial-22-left",
                            "src": "tabby_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-22-right",
                            "src": "robin_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-23",
                    "audio": "see_1_silence_the_fish_see_2",
                    "images": [{
                            "id": "order1B-locationflip-trial-23-left",
                            "src": "kookaburra_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-23-right",
                            "src": "betafish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-24",
                    "audio": "where_1_silence_the_dog_1",
                    "images": [{
                            "id": "order1B-locationflip-trial-24-left",
                            "src": "sheepdog_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-24-right",
                            "src": "sphynx_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-25",
                    "audio": "acrossTheUniverse000",
                    "images": [{
                            "id": "order1B-locationflip-trial-25-left",
                            "src": "balloons_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-25-right",
                            "src": "balloons_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-26",
                    "audio": "look_1_silence_the_dog_1",
                    "images": [{
                            "id": "order1B-locationflip-trial-26-left",
                            "src": "kingfisher_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-26-right",
                            "src": "afghanhound_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-27",
                    "audio": "find_1_silence_the_fish_4",
                    "images": [{
                            "id": "order1B-locationflip-trial-27-left",
                            "src": "lionfish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-27-right",
                            "src": "oriental_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-28",
                    "audio": "where_1_silence_the_bird_1",
                    "images": [{
                            "id": "order1B-locationflip-trial-28-left",
                            "src": "cardinal_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-28-right",
                            "src": "clownfish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-29",
                    "audio": "see_1_silence_the_cat_see_3",
                    "images": [{
                            "id": "order1B-locationflip-trial-29-left",
                            "src": "germanshepherd_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order1B-locationflip-trial-29-right",
                            "src": "arabianmau_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order1B-locationflip-trial-30",
                    "audio": "done",
                    "doRecording": false,
                    "images": [{
                        "id": "order1B-locationflip-trial-30-end",
                        "src": "endPhoto.jpg",
                        "position": "fill"
                    }]
                }
            ],
            "commonFrameProperties": {
                "kind": "exp-lookit-images-audio",
                "baseDir": "https://raw.githubusercontent.com/mzettersten/lwl_typ_animals/master/lookit_experiments/",
                "pageColor": "gray",
                "maximizesDisplay": true,
                "durationSeconds": 7.2,
                "doRecording": true,
                "showWaitForRecordingMessage": true,
                "showWaitForUploadingMessage": true,
                "waitForRecordingMessage": " ",
                "waitForUploadMessage": " ",
                "waitForRecordingMessageColor": "gray",
                "waitForUploadMessageColor": "gray",
                "maxUploadSeconds": 10,
                "audioTypes": [
                    "mp3",
                    "ogg"
                ],
                "videoTypes": [
                    "mp4",
                    "webm"
                ],
                "autoProceed": true,
                "backgroundColor": "gray",
                "announcementLength": 0,
                "pauseWhenExitingFullscreen": true,
                "allowUserPause": true,
                "frameOffsetAfterPause": 1,
                "pausedText": "The study is paused. \n\n Please reposition your baby and press the space bar to continue. \n\n If you would like to end the study press crl-X or F1."
            }
        },
        "cond-2A-locationflip": {
            "kind": "group",
            "frameList": [{
                    "id": "order2A-locationflip-trial-1",
                    "audio": "look_1_silence_the_bird_1",
                    "images": [{
                            "id": "order2A-locationflip-trial-1-left",
                            "src": "sparrow_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-1-right",
                            "src": "arabianmau_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-2",
                    "audio": "see_1_silence_the_dog_see_1",
                    "images": [{
                            "id": "order2A-locationflip-trial-2-left",
                            "src": "cardinal_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-2-right",
                            "src": "germanshepherd_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-3",
                    "audio": "where_1_silence_the_cat_1",
                    "images": [{
                            "id": "order2A-locationflip-trial-3-left",
                            "src": "oriental_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-3-right",
                            "src": "kookaburra_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-4",
                    "audio": "find_1_silence_the_fish_4",
                    "images": [{
                            "id": "order2A-locationflip-trial-4-left",
                            "src": "kingfisher_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-4-right",
                            "src": "lionfish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-5",
                    "audio": "acrossTheUniverse000",
                    "images": [{
                            "id": "order2A-locationflip-trial-5-left",
                            "src": "balloons_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-5-right",
                            "src": "balloons_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-6",
                    "audio": "see_1_silence_the_dog_see_1",
                    "images": [{
                            "id": "order2A-locationflip-trial-6-left",
                            "src": "heron_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-6-right",
                            "src": "bassethound_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-7",
                    "audio": "find_1_silence_the_bird_1",
                    "images": [{
                            "id": "order2A-locationflip-trial-7-left",
                            "src": "bluegill_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-7-right",
                            "src": "robin_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-8",
                    "audio": "where_1_silence_the_cat_1",
                    "images": [{
                            "id": "order2A-locationflip-trial-8-left",
                            "src": "chartreux_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-8-right",
                            "src": "goldenretriever_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-9",
                    "audio": "look_1_silence_the_fish_4",
                    "images": [{
                            "id": "order2A-locationflip-trial-9-left",
                            "src": "sturgeon_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-9-right",
                            "src": "sphynx_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-10",
                    "audio": "yellow001",
                    "images": [{
                            "id": "order2A-locationflip-trial-10-left",
                            "src": "beach_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-10-right",
                            "src": "beach_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-11",
                    "audio": "where_1_silence_the_bird_1",
                    "images": [{
                            "id": "order2A-locationflip-trial-11-left",
                            "src": "lionfish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-11-right",
                            "src": "kingfisher_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-12",
                    "audio": "see_1_silence_the_cat_see_3",
                    "images": [{
                            "id": "order2A-locationflip-trial-12-left",
                            "src": "cornishrex_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-12-right",
                            "src": "afghanhound_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-13",
                    "audio": "find_1_silence_the_fish_4",
                    "images": [{
                            "id": "order2A-locationflip-trial-13-left",
                            "src": "tabby_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-13-right",
                            "src": "clownfish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-14",
                    "audio": "look_1_silence_the_dog_1",
                    "images": [{
                            "id": "order2A-locationflip-trial-14-left",
                            "src": "beagle_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-14-right",
                            "src": "bass_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-15",
                    "audio": "acrossTheUniverse016",
                    "images": [{
                            "id": "order2A-locationflip-trial-15-left",
                            "src": "fireworks_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-15-right",
                            "src": "fireworks_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-16",
                    "audio": "find_1_silence_the_dog_1",
                    "images": [{
                            "id": "order2A-locationflip-trial-16-left",
                            "src": "afghanhound_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-16-right",
                            "src": "cornishrex_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-17",
                    "audio": "where_1_silence_the_fish_4",
                    "images": [{
                            "id": "order2A-locationflip-trial-17-left",
                            "src": "sheepdog_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-17-right",
                            "src": "betafish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-18",
                    "audio": "see_1_silence_the_bird_see_1",
                    "images": [{
                            "id": "order2A-locationflip-trial-18-left",
                            "src": "cardinal_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-18-right",
                            "src": "germanshepherd_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-19",
                    "audio": "look_1_silence_the_cat_1",
                    "images": [{
                            "id": "order2A-locationflip-trial-19-left",
                            "src": "sparrow_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-19-right",
                            "src": "arabianmau_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-20",
                    "audio": "yellow001",
                    "images": [{
                            "id": "order2A-locationflip-trial-20-left",
                            "src": "mountain_left_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-20-right",
                            "src": "mountain_right_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-21",
                    "audio": "where_1_silence_the_cat_1",
                    "images": [{
                            "id": "order2A-locationflip-trial-21-left",
                            "src": "clownfish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-21-right",
                            "src": "tabby_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-22",
                    "audio": "find_1_silence_the_dog_1",
                    "images": [{
                            "id": "order2A-locationflip-trial-22-left",
                            "src": "sheepdog_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-22-right",
                            "src": "betafish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-23",
                    "audio": "see_1_silence_the_fish_see_2",
                    "images": [{
                            "id": "order2A-locationflip-trial-23-left",
                            "src": "bass_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-23-right",
                            "src": "beagle_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-24",
                    "audio": "look_1_silence_the_bird_1",
                    "images": [{
                            "id": "order2A-locationflip-trial-24-left",
                            "src": "oriental_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-24-right",
                            "src": "kookaburra_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-25",
                    "audio": "acrossTheUniverse000",
                    "images": [{
                            "id": "order2A-locationflip-trial-25-left",
                            "src": "water_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-25-right",
                            "src": "water_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-26",
                    "audio": "see_1_silence_the_fish_see_2",
                    "images": [{
                            "id": "order2A-locationflip-trial-26-left",
                            "src": "bluegill_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-26-right",
                            "src": "robin_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-27",
                    "audio": "find_1_silence_the_cat_1",
                    "images": [{
                            "id": "order2A-locationflip-trial-27-left",
                            "src": "sturgeon_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-27-right",
                            "src": "sphynx_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-28",
                    "audio": "where_1_silence_the_dog_1",
                    "images": [{
                            "id": "order2A-locationflip-trial-28-left",
                            "src": "chartreux_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-28-right",
                            "src": "goldenretriever_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-29",
                    "audio": "look_1_silence_the_bird_1",
                    "images": [{
                            "id": "order2A-locationflip-trial-29-left",
                            "src": "heron_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2A-locationflip-trial-29-right",
                            "src": "bassethound_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2A-locationflip-trial-30",
                    "audio": "done",
                    "doRecording": false,
                    "images": [{
                        "id": "order2A-locationflip-trial-30-end",
                        "src": "endPhoto.jpg",
                        "position": "fill"
                    }]
                }
            ],
            "commonFrameProperties": {
                "kind": "exp-lookit-images-audio",
                "baseDir": "https://raw.githubusercontent.com/mzettersten/lwl_typ_animals/master/lookit_experiments/",
                "pageColor": "gray",
                "maximizesDisplay": true,
                "durationSeconds": 7.2,
                "doRecording": true,
                "showWaitForRecordingMessage": true,
                "showWaitForUploadingMessage": true,
                "waitForRecordingMessage": " ",
                "waitForUploadMessage": " ",
                "waitForRecordingMessageColor": "gray",
                "waitForUploadMessageColor": "gray",
                "maxUploadSeconds": 10,
                "audioTypes": [
                    "mp3",
                    "ogg"
                ],
                "videoTypes": [
                    "mp4",
                    "webm"
                ],
                "autoProceed": true,
                "backgroundColor": "gray",
                "announcementLength": 0,
                "pauseWhenExitingFullscreen": true,
                "allowUserPause": true,
                "frameOffsetAfterPause": 1,
                "pausedText": "The study is paused. \n\n Please reposition your baby and press the space bar to continue. \n\n If you would like to end the study press crl-X or F1."
            }
        },
        "cond-2B-locationflip": {
            "kind": "group",
            "frameList": [{
                    "id": "order2B-locationflip-trial-1",
                    "audio": "look_1_silence_the_bird_1",
                    "images": [{
                            "id": "order2B-locationflip-trial-1-left",
                            "src": "bassethound_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-1-right",
                            "src": "heron_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-2",
                    "audio": "where_1_silence_the_dog_1",
                    "images": [{
                            "id": "order2B-locationflip-trial-2-left",
                            "src": "goldenretriever_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-2-right",
                            "src": "chartreux_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-3",
                    "audio": "find_1_silence_the_cat_1",
                    "images": [{
                            "id": "order2B-locationflip-trial-3-left",
                            "src": "sphynx_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-3-right",
                            "src": "sturgeon_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-4",
                    "audio": "see_1_silence_the_fish_see_2",
                    "images": [{
                            "id": "order2B-locationflip-trial-4-left",
                            "src": "robin_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-4-right",
                            "src": "bluegill_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-5",
                    "audio": "acrossTheUniverse000",
                    "images": [{
                            "id": "order2B-locationflip-trial-5-left",
                            "src": "water_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-5-right",
                            "src": "water_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-6",
                    "audio": "look_1_silence_the_bird_1",
                    "images": [{
                            "id": "order2B-locationflip-trial-6-left",
                            "src": "kookaburra_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-6-right",
                            "src": "oriental_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-7",
                    "audio": "see_1_silence_the_fish_see_2",
                    "images": [{
                            "id": "order2B-locationflip-trial-7-left",
                            "src": "beagle_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-7-right",
                            "src": "bass_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-8",
                    "audio": "find_1_silence_the_dog_1",
                    "images": [{
                            "id": "order2B-locationflip-trial-8-left",
                            "src": "betafish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-8-right",
                            "src": "sheepdog_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-9",
                    "audio": "where_1_silence_the_cat_1",
                    "images": [{
                            "id": "order2B-locationflip-trial-9-left",
                            "src": "tabby_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-9-right",
                            "src": "clownfish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-10",
                    "audio": "yellow001",
                    "images": [{
                            "id": "order2B-locationflip-trial-10-left",
                            "src": "mountain_left_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-10-right",
                            "src": "mountain_right_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-11",
                    "audio": "look_1_silence_the_cat_1",
                    "images": [{
                            "id": "order2B-locationflip-trial-11-left",
                            "src": "arabianmau_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-11-right",
                            "src": "sparrow_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-12",
                    "audio": "see_1_silence_the_bird_see_1",
                    "images": [{
                            "id": "order2B-locationflip-trial-12-left",
                            "src": "germanshepherd_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-12-right",
                            "src": "cardinal_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-13",
                    "audio": "where_1_silence_the_fish_4",
                    "images": [{
                            "id": "order2B-locationflip-trial-13-left",
                            "src": "betafish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-13-right",
                            "src": "sheepdog_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-14",
                    "audio": "find_1_silence_the_dog_1",
                    "images": [{
                            "id": "order2B-locationflip-trial-14-left",
                            "src": "cornishrex_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-14-right",
                            "src": "afghanhound_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-15",
                    "audio": "acrossTheUniverse016",
                    "images": [{
                            "id": "order2B-locationflip-trial-15-left",
                            "src": "fireworks_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-15-right",
                            "src": "fireworks_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-16",
                    "audio": "look_1_silence_the_dog_1",
                    "images": [{
                            "id": "order2B-locationflip-trial-16-left",
                            "src": "bass_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-16-right",
                            "src": "beagle_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-17",
                    "audio": "find_1_silence_the_fish_4",
                    "images": [{
                            "id": "order2B-locationflip-trial-17-left",
                            "src": "clownfish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-17-right",
                            "src": "tabby_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-18",
                    "audio": "see_1_silence_the_cat_see_3",
                    "images": [{
                            "id": "order2B-locationflip-trial-18-left",
                            "src": "afghanhound_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-18-right",
                            "src": "cornishrex_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-19",
                    "audio": "where_1_silence_the_bird_1",
                    "images": [{
                            "id": "order2B-locationflip-trial-19-left",
                            "src": "kingfisher_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-19-right",
                            "src": "lionfish_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-20",
                    "audio": "yellow001",
                    "images": [{
                            "id": "order2B-locationflip-trial-20-left",
                            "src": "beach_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-20-right",
                            "src": "beach_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-21",
                    "audio": "look_1_silence_the_fish_4",
                    "images": [{
                            "id": "order2B-locationflip-trial-21-left",
                            "src": "sphynx_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-21-right",
                            "src": "sturgeon_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-22",
                    "audio": "where_1_silence_the_cat_1",
                    "images": [{
                            "id": "order2B-locationflip-trial-22-left",
                            "src": "goldenretriever_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-22-right",
                            "src": "chartreux_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-23",
                    "audio": "find_1_silence_the_bird_1",
                    "images": [{
                            "id": "order2B-locationflip-trial-23-left",
                            "src": "robin_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-23-right",
                            "src": "bluegill_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-24",
                    "audio": "see_1_silence_the_dog_see_1",
                    "images": [{
                            "id": "order2B-locationflip-trial-24-left",
                            "src": "bassethound_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-24-right",
                            "src": "heron_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-25",
                    "audio": "acrossTheUniverse000",
                    "images": [{
                            "id": "order2B-locationflip-trial-25-left",
                            "src": "balloons_left.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-25-right",
                            "src": "balloons_right.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-26",
                    "audio": "find_1_silence_the_fish_4",
                    "images": [{
                            "id": "order2B-locationflip-trial-26-left",
                            "src": "lionfish_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-26-right",
                            "src": "kingfisher_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-27",
                    "audio": "where_1_silence_the_cat_1",
                    "images": [{
                            "id": "order2B-locationflip-trial-27-left",
                            "src": "kookaburra_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-27-right",
                            "src": "oriental_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-28",
                    "audio": "see_1_silence_the_dog_see_1",
                    "images": [{
                            "id": "order2B-locationflip-trial-28-left",
                            "src": "germanshepherd_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-28-right",
                            "src": "cardinal_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-29",
                    "audio": "look_1_silence_the_bird_1",
                    "images": [{
                            "id": "order2B-locationflip-trial-29-left",
                            "src": "arabianmau_600x600.jpg",
                            "position": "left"
                        },
                        {
                            "id": "order2B-locationflip-trial-29-right",
                            "src": "sparrow_600x600.jpg",
                            "position": "right"
                        }
                    ]
                },
                {
                    "id": "order2B-locationflip-trial-30",
                    "audio": "done",
                    "doRecording": false,
                    "images": [{
                        "id": "order2B-locationflip-trial-30-end",
                        "src": "endPhoto.jpg",
                        "position": "fill"
                    }]
                }
            ],
            "commonFrameProperties": {
                "kind": "exp-lookit-images-audio",
                "baseDir": "https://raw.githubusercontent.com/mzettersten/lwl_typ_animals/master/lookit_experiments/",
                "pageColor": "gray",
                "maximizesDisplay": true,
                "durationSeconds": 7.2,
                "doRecording": true,
                "showWaitForRecordingMessage": true,
                "showWaitForUploadingMessage": true,
                "waitForRecordingMessage": " ",
                "waitForUploadMessage": " ",
                "waitForRecordingMessageColor": "gray",
                "waitForUploadMessageColor": "gray",
                "maxUploadSeconds": 10,
                "audioTypes": [
                    "mp3",
                    "ogg"
                ],
                "videoTypes": [
                    "mp4",
                    "webm"
                ],
                "autoProceed": true,
                "backgroundColor": "gray",
                "announcementLength": 0,
                "pauseWhenExitingFullscreen": true,
                "allowUserPause": true,
                "frameOffsetAfterPause": 1,
                "pausedText": "The study is paused. \n\n Please reposition your baby and press the space bar to continue. \n\n If you would like to end the study press crl-X or F1."
            }
        },
        "video-consent": {
            "gdpr": false,
            "kind": "exp-lookit-video-consent",
            "PIName": "Jenny Saffran",
            "datause": "If the researchers do not receive a consent recording (the video you'll make to the right) for this session and cannot verify that you agreed to participate, no other video from your session will be analyzed or retained by the UW-Madison study team. As per the Lookit terms of use agreement, Lookit may retain the videos for their own purposes but will not analyze the video data.",
            "payment": "You will receive a $5 Amazon gift card for participating in this session. If you or your child do not complete the session, you will still receive this compensation.",
            "purpose": "The purpose of this study is to understand how infants and young children learn about language.",
            "template": "consent_002",
            "PIContact": "Infant Learning Lab at (608) 263-5876",
            "procedures": "Your child will listen to words and view images on a screen. You and your child will be asked to complete 2 sessions over the course of the study. You may also be asked to respond to questions about your child’s language development, as well as other aspects of your child’s experience (e.g., non-English language exposure). There are no known risks involved in this procedure, particularly since the sounds are presented to the child at a loudness level typical of normal conversation. To facilitate the research process, please try to minimize distractions to your child during the study. If someone other than your child or yourself appears on the video screen during the recording, the researchers will attempt to edit their faces or other identifiable information out of the video. Only video data from your child will be analyzed.",
            "institution": "University of Wisconsin - Madison",
            "prompt_all_adults": true,
            "research_rights_statement": "You have been informed of the testing procedures that will be used, and have had the opportunity to ask further questions if necessary to clarify these procedures.  Your participation in this study is voluntary.  You will receive a gift card as a thank-you for your child’s participation, and will also learn more about how infants learn about auditory events in their environment.  Other than this knowledge, the experiment will be of no direct benefit to you or to your child.  If you have questions about my rights as a participant, or the rights of your child, you can contact the University of Wisconsin – Madison Social and Behavioral Sciences Institutional Review Board at 608-263-2320. If the researchers see or suspect child abuse or neglect when they view your webcam videos, they are required by state law to report it. Confidentiality would be broken in this case."
        },
        "preload-stimuli": {
            "kind": "exp-lookit-change-detection",
            "border": "thick solid gray",
            "baseDir": "https://raw.githubusercontent.com/mzettersten/lwl_typ_animals/master/lookit_experiments/mp4/",
            "blankMs": 0,
            "displayMs": 0,
            "doRecording": false,
            "attnLength": 0,
            "audioTypes": [
                "mp3",
                "ogg"
            ],
            "startWithA": true,
            "videoTypes": [
                "mp4",
                "webm"
            ],
            "leftImagesA": [
                "afghanhound_600x600.jpg",
                "arabianmau_600x600.jpg",
                "balloons_left.jpg",
                "balloons_right.jpg",
                "bass_600x600.jpg",
                "bassethound_600x600.jpg",
                "beach_left.jpg",
                "beach_right.jpg",
                "beagle_600x600.jpg",
                "betafish_600x600.jpg",
                "bluegill_600x600.jpg",
                "cardinal_600x600.jpg",
                "chartreux_600x600.jpg",
                "clownfish_600x600.jpg",
                "cornishrex_600x600.jpg",
                "fireworks_left.jpg",
                "fireworks_right.jpg",
                "germanshepherd_600x600.jpg",
                "goldenretriever_600x600.jpg",
                "heron_600x600.jpg",
                "kingfisher_600x600.jpg",
                "kookaburra_600x600.jpg",
                "lionfish_600x600.jpg",
                "mountain_left_600x600.jpg",
                "mountain_right_600x600.jpg",
                "oriental_600x600.jpg",
                "robin_600x600.jpg",
                "sheepdog_600x600.jpg",
                "sparrow_600x600.jpg",
                "sphynx_600x600.jpg",
                "sturgeon_600x600.jpg",
                "tabby_600x600.jpg",
                "water_left.jpg",
                "water_right.jpg"
            ],
            "leftImagesB": [],
            "trialLength": 0,
            "rightImagesA": [],
            "rightImagesB": [],
            "videoSources": "LoadingStim",
            "containerColor": "gray",
            "backgroundColor": "gray",
            "randomizeImageOrder": true
        },
        "study-instructions": {
            "kind": "exp-lookit-instruction-video",
            "instructionsVideo": [{
                "src": "https://raw.githubusercontent.com/mzettersten/lwl_typ_animals/master/lookit_experiments/mp4/introductionVideo2CC.mp4",
                "type": "video/mp4"
            }],
            "introText": "Let's get ready! Please watch this video to learn what to do during the study. \n(Or you can read the summary to the right if you prefer.)",
            "transcriptTitle": "Video summary",
            "transcriptBlocks": [{
                    "title": "What to do during the study:",
                    "listblocks": [{
                            "text": "If your child gets fussy or distracted during the study, or you need to attend to something else for a moment, you can pause the study by pressing the spacebar."
                        },
                        {
                            "text": "If you notice that your baby is becoming bored or too fussy to finish the study, that is perfectly OK and quite common. You can stop at any point."
                        },
                        {
                            "text": "If you need to end the study early, you can press ctr-X or the F1 key to end the study. Select <b>“exit”</b> in the box that will appear on the screen. This will take you to the end of the study."
                        },
                        {
                            "text": "Even if you end the study early we can still use the data from the parts that your baby was looking — you don’t need to finish the study for your data to be usable."
                        }
                    ]
                },
                {
                    "title": "Your role during the study:"
                },
                {
                    "listblocks": [{
                            "text": "Your job is to keep your baby seated on your lap and facing the computer screen so we will be able to see their eyes during the whole study. On the next page you will see an example of what this should look like."
                        },
                        {
                            "text": "Don’t worry if you feel your baby becoming bored. Even if your baby only looks at the screen a little bit, we are still collecting valuable data from your baby."
                        }
                    ]
                },
                {
                    "title": "Please close your eyes during the study"
                },
                {
                    "listblocks": [{
                            "text": "The most important role you have during the study is to keep your eyes closed. We know this sounds a little strange, but believe it or not, your baby is learning from you and where you look at every moment. "
                        },
                        {
                            "text": "We also ask that you don’t talk to your baby or try to direct their attention in any way during the study."
                        },
                        {
                            "text": "You will hear an audio prompt when the study is finished letting you know that the study is over and that you can open your eyes. The study will last about 4-5 minutes in total."
                        }
                    ]
                },
                {
                    "title": "What to do when the study is finished:",
                    "listblocks": [{
                            "text": "Once the study has finished playing, you’ll be given an opportunity to report any technical problems you may have experienced along the way."
                        },
                        {
                            "text": "Lastly, you’ll be able to select a privacy level for your videos."
                        },
                        {
                            "text": "If this is your second session, we will also ask you to complete a short survey that asks about your baby's experiences with animals. "
                        }
                    ]
                }
            ],
            "warningText": "Please watch the video or read the summary before proceeding.",
            "nextButtonText": "Getting in position",
            "title": "Study instructions",
            "showPreviousButton": false
        },
        "setup-instructions": {
            "kind": "exp-lookit-instructions",
            "blocks": [{
                    "title": "Caregiver's role",
                    "listblocks": [{
                            "text": "Keep your baby facing forward and seated on your lap."
                        },
                        {
                            "text": "Close your eyes, and try your best to avoid talking or pointing to your baby."
                        }
                    ]
                },
                {
                    "text": "Because this is an online study, we will check to make sure your webcam is working so that we can see you and your baby during the study. Please sit facing the monitor, holding your child on your lap, like you see below. Your child can sit or stand as long as <strong> the webcam is angled up or down so that both you and your child's eyes are visible</strong>. If you're not sure if both you and your child's eyes will be visible, you can check the video preview on the right side of the screen!",
                    "image": {
                        "alt": "Example image showing a mom holding her child on lap.",
                        "src": "https://raw.githubusercontent.com/mzettersten/lwl_typ_animals/master/lookit_experiments/img/placeholder_lap_image.jpg"
                    },
                    "title": "Holding your baby"
                },
                {
                    "text": "This study requires that your child listens to some sentences labeling animals. Please listen to the sample audio on this page and adjust your volume level so that it resembles a person's voice in the room.",
                    "title": "Sound check",
                    "mediaBlock": {
                        "text": "You should hear 'Ready to go?'",
                        "isVideo": false,
                        "sources": [{
                                "src": "https://raw.githubusercontent.com/mzettersten/lwl_typ_animals/master/lookit_experiments/mp3/ready.mp3",
                                "type": "audio/mp3"
                            },
                            {
                                "src": "https://raw.githubusercontent.com/mzettersten/lwl_typ_animals/master/lookit_experiments/ogg/ready.ogg",
                                "type": "audio/ogg"
                            }
                        ],
                        "mustPlay": true,
                        "warningText": "Please try playing the sample audio."
                    }
                }
            ],
            "showWebcam": true,
            "requireTestVideo": true,
            "showRecordMenu": true,
            "webcamBlocks": [{
                "title": "This is what your video will look like",
                "listblocks": [{
                        "text": "If possible, you should position yourself and your baby so that they are seated on your lap with the computer on another surface (i.e., table) in a room that is <b>well lit </b> and has few distrations."
                    },
                    {
                        "text": "You should check to make sure we will be able to see your child's face well"
                    }
                ]
            }],
            "nextButtonText": "Next"
        },
        "parent-exit-survey": {
            "kind": "exp-lookit-exit-survey",
            "debriefing": {
                "text": debrief_text,
                "image": {
                    "alt": "thank you",
                    "src": "https://raw.githubusercontent.com/mzettersten/lwl_typ_animals/master/lookit_experiments/img/exit_survey_image.png"
                },
                "title": "Thank you!"
            }
        }
    };

    let frame_sequence = [
        "eligibility-survey",
        "eligibility-procedure",
        "study-intro",
        "video-config",
        "video-consent",
        "study-instructions",
        "setup-instructions",
        "preload-stimuli",
        "webcam-display",
        "exp-get-ready",
        "exp-calibration",
        condition,
        "parent-exit-survey"
    ]

    return {
        frames: frames,
        sequence: frame_sequence
    };
}