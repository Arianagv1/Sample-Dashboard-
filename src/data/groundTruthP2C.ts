import { TouchpointRecord } from '../types';

export const RAW_CSV_GROUND_TRUTH = `conversion_id,user_id_pseudo,conversion_timestamp,conversion_type,conversion_revenue,conversion_currency,interaction_number,interaction_timestamp,days_prior_to_conversion,interaction_type,channel_grouping,site_placement_name,campaign_name,ad_group_name,creative_type,is_converting_interaction,gclid
CNV_1001,usr_8f92a1,2026-08-28 14:22:10,Purchase_Confirmation,149.99,USD,1,2026-06-05 09:12:00,84,Impression,CTV/Video,YouTube_ConnectedTV,Fall_Brand_Awareness,Audience_InMarket_Tech,NonSkip_Video_30s,FALSE,
CNV_1001,usr_8f92a1,2026-08-28 14:22:10,Purchase_Confirmation,149.99,USD,2,2026-07-15 11:45:33,44,Impression,Display,NYTimes_Mobile_App,Fall_Brand_Awareness,Retargeting_SiteVisitors,300x250_Banner,FALSE,
CNV_1001,usr_8f92a1,2026-08-28 14:22:10,Purchase_Confirmation,149.99,USD,3,2026-08-20 18:02:11,8,Click,Social,Instagram_Feed,Performance_Max_Promo,Lookalike_Purchasers,Story_Carousel,FALSE,
CNV_1001,usr_8f92a1,2026-08-28 14:22:10,Purchase_Confirmation,149.99,USD,4,2026-08-28 14:20:05,0,Click,Paid Search,Google_Search,Search_Brand_Core,Brand_Exact_Keywords,Text_ResponsiveAd,TRUE,CjwKCAiA_gclBhBWEiwA3v58J_GCLID_1001
CNV_1002,usr_4b11c9,2026-08-30 09:10:45,Lead_Form_Submit,0.00,USD,1,2026-06-01 16:30:22,90,Impression,Display,TechCrunch_Desktop,B2B_SaaS_MidFunnel,IT_Decision_Makers,728x90_Leaderboard,FALSE,
CNV_1002,usr_4b11c9,2026-08-30 09:10:45,Lead_Form_Submit,0.00,USD,2,2026-08-29 20:15:10,1,Click,Paid Search,Google_Search,Search_Generic_Software,Cloud_Management_Phrase,Text_ResponsiveAd,TRUE,CjwKCAiA_gclBhBWEiwA3v58J_GCLID_1002
CNV_1003,usr_7e33f4,2026-08-31 19:40:00,Purchase_Confirmation,89.50,USD,1,2026-08-31 19:35:12,0,Click,Paid Search,Google_Search,Search_Brand_Core,Brand_Exact_Keywords,Text_ResponsiveAd,TRUE,CjwKCAiA_gclBhBWEiwA3v58J_GCLID_1003
CNV_1004,usr_1a88b2,2026-09-01 10:05:30,Purchase_Confirmation,299.00,USD,1,2026-07-02 12:00:00,61,Impression,CTV/Video,Hulu_App,Fall_Brand_Awareness,Demographic_18_34,InStream_Video_15s,FALSE,
CNV_1004,usr_1a88b2,2026-09-01 10:05:30,Purchase_Confirmation,299.00,USD,2,2026-08-10 15:22:40,22,Click,Display,ESPN_Web,Retargeting_AbandonedCart,Dynamic_Product_Feed,300x600_HalfPage,FALSE,
CNV_1004,usr_1a88b2,2026-09-01 10:05:30,Purchase_Confirmation,299.00,USD,3,2026-08-25 08:14:02,7,Impression,Display,Forbes_Desktop,Fall_Brand_Awareness,Audience_InMarket_Tech,300x250_Banner,FALSE,
CNV_1004,usr_1a88b2,2026-09-01 10:05:30,Purchase_Confirmation,299.00,USD,4,2026-09-01 10:01:15,0,Click,Paid Search,Google_Search,Search_Brand_Core,Brand_Exact_Keywords,Text_ResponsiveAd,TRUE,CjwKCAiA_gclBhBWEiwA3v58J_GCLID_1004
CNV_1005,usr_9c22e5,2026-08-25 16:45:00,Hotel_Booking_Complete,1250.00,USD,1,2026-06-11 08:30:10,75,Impression,CTV/Video,YouTube_ConnectedTV,Summer_Travel_Resorts,Travel_Intenders_USA,NonSkip_Video_30s,FALSE,
CNV_1005,usr_9c22e5,2026-08-25 16:45:00,Hotel_Booking_Complete,1250.00,USD,2,2026-07-02 14:12:00,54,Click,Paid Search,Google_Search,Search_Generic_Travel,Luxury_Resorts_Broad,Text_ResponsiveAd,FALSE,CjwKCAiA_gclBhBWEiwA3v58J_GCLID_1005a
CNV_1005,usr_9c22e5,2026-08-25 16:45:00,Hotel_Booking_Complete,1250.00,USD,3,2026-07-28 19:20:44,28,Impression,Display,TripAdvisor_Web,Retargeting_ResortViews,Native_InFeed_Card,FALSE,
CNV_1005,usr_9c22e5,2026-08-25 16:45:00,Hotel_Booking_Complete,1250.00,USD,4,2026-08-15 11:05:12,10,Click,Paid Social,Facebook_Feed,Summer_Travel_Resorts,CustomAudience_CRM,Carousel_Image_Ad,FALSE,
CNV_1005,usr_9c22e5,2026-08-25 16:45:00,Hotel_Booking_Complete,1250.00,USD,5,2026-08-25 16:40:02,0,Click,Paid Search,Google_Search,Search_Brand_Resorts,Brand_Exact_Keywords,Text_ResponsiveAd,TRUE,CjwKCAiA_gclBhBWEiwA3v58J_GCLID_1005b
CNV_1006,usr_3d66a8,2026-08-27 11:15:30,Newsletter_Signup,0.00,USD,1,2026-08-12 10:00:00,15,Impression,Audio/Podcast,Spotify_App,Podcast_Sponsorship_Q3,Tech_Podcast_Listeners,Audio_Spot_30s,FALSE,
CNV_1006,usr_3d66a8,2026-08-27 11:15:30,Newsletter_Signup,0.00,USD,2,2026-08-27 11:12:00,0,Click,Display,Reddit_Mobile_App,Paid_Community_Outreach,Subreddit_Tech_Interest,Native_Promoted_Post,TRUE,
CNV_1007,usr_6f44d1,2026-08-29 18:00:12,Schedule_Test_Drive,0.00,USD,1,2026-06-15 13:22:00,75,Impression,CTV/Video,Roku_Stream,EV_Launch_Campaign,Auto_InMarket_EV,InStream_Video_30s,FALSE,
CNV_1007,usr_6f44d1,2026-08-29 18:00:12,Schedule_Test_Drive,0.00,USD,2,2026-07-10 17:40:15,50,Impression,Display,CarAndDriver_Web,EV_Launch_Campaign,Auto_Enthusiasts,970x250_Billboard,FALSE,
CNV_1007,usr_6f44d1,2026-08-29 18:00:12,Schedule_Test_Drive,0.00,USD,3,2026-08-18 09:12:30,11,Click,Paid Search,Google_Search,Search_EV_Models,EV_SUV_Phrase,Text_ResponsiveAd,FALSE,CjwKCAiA_gclBhBWEiwA3v58J_GCLID_1007a
CNV_1007,usr_6f44d1,2026-08-29 18:00:12,Schedule_Test_Drive,0.00,USD,4,2026-08-29 17:55:00,0,Click,Paid Search,Google_Search,Search_Dealer_Brand,Dealer_Local_Exact,Text_ResponsiveAd,TRUE,CjwKCAiA_gclBhBWEiwA3v58J_GCLID_1007b
CNV_1008,usr_2e99f0,2026-08-30 21:05:19,Free_Trial_Start,0.00,USD,1,2026-07-20 15:10:00,41,Impression,Social,TikTok_App,App_Install_GenZ,Interest_Fitness_Wellness,Vertical_Video_15s,FALSE,
CNV_1008,usr_2e99f0,2026-08-30 21:05:19,Free_Trial_Start,0.00,USD,2,2026-08-12 12:30:00,18,Impression,Display,MyFitnessPal_App,Retargeting_App_Installs,320x50_Mobile_Banner,FALSE,
CNV_1008,usr_2e99f0,2026-08-30 21:05:19,Free_Trial_Start,0.00,USD,3,2026-08-30 21:00:01,0,Click,Paid Social,TikTok_App,App_Install_GenZ,Retargeting_SiteVisitors,Vertical_Video_15s,TRUE,
CNV_1009,usr_5a11b3,2026-08-31 14:10:00,Credit_Card_Apply,0.00,USD,1,2026-06-02 11:00:00,90,Impression,Display,Bloomberg_Web,Financial_Rewards_Launch,High_Income_Affluent,300x250_Banner,FALSE,
CNV_1009,usr_5a11b3,2026-08-31 14:10:00,Credit_Card_Apply,0.00,USD,2,2026-07-14 16:22:10,48,Click,Paid Search,Google_Search,Search_Generic_Cards,Rewards_Credit_Cards,Text_ResponsiveAd,FALSE,CjwKCAiA_gclBhBWEiwA3v58J_GCLID_1009a
CNV_1009,usr_5a11b3,2026-08-31 14:10:00,Credit_Card_Apply,0.00,USD,3,2026-08-20 10:45:00,11,Impression,Display,WSJ_Desktop,Financial_Rewards_Launch,High_Income_Affluent,728x90_Leaderboard,FALSE,
CNV_1009,usr_5a11b3,2026-08-31 14:10:00,Credit_Card_Apply,0.00,USD,4,2026-08-31 14:02:15,0,Click,Paid Search,Google_Search,Search_Brand_Cards,Brand_Rewards_Exact,Text_ResponsiveAd,TRUE,CjwKCAiA_gclBhBWEiwA3v58J_GCLID_1009b
CNV_1010,usr_0c88f7,2026-09-01 08:22:14,Purchase_Confirmation,64.20,USD,1,2026-08-28 19:10:00,3,Impression,Display,WeatherChannel_App,End_Of_Summer_Sale,Geo_Targeted_Urban,300x250_Banner,FALSE,
CNV_1010,usr_0c88f7,2026-09-01 08:22:14,Purchase_Confirmation,64.20,USD,2,2026-09-01 08:18:40,0,Click,Paid Search,Google_Search,Search_Brand_Core,Brand_Exact_Keywords,Text_ResponsiveAd,TRUE,CjwKCAiA_gclBhBWEiwA3v58J_GCLID_1010`;

export function parseCSVToTouchpoints(csvString: string): TouchpointRecord[] {
  const lines = csvString.trim().split('\n');
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map((h) => h.trim());
  const records: TouchpointRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = line.split(',').map((v) => v.trim());
    if (values.length < 15) continue;

    records.push({
      conversion_id: values[0] || '',
      user_id_pseudo: values[1] || '',
      conversion_timestamp: values[2] || '',
      conversion_type: values[3] || '',
      conversion_revenue: parseFloat(values[4]) || 0,
      conversion_currency: values[5] || 'USD',
      interaction_number: parseInt(values[6], 10) || 1,
      interaction_timestamp: values[7] || '',
      days_prior_to_conversion: parseInt(values[8], 10) || 0,
      interaction_type: (values[9] === 'Click' ? 'Click' : 'Impression'),
      channel_grouping: (values[10] as any) || 'Display',
      site_placement_name: values[11] || '',
      campaign_name: values[12] || '',
      ad_group_name: values[13] || '',
      creative_type: values[14] || '',
      is_converting_interaction: values[15]?.toUpperCase() === 'TRUE',
      gclid: values[16]?.trim() || '',
    });
  }

  return records;
}

export const GROUND_TRUTH_TOUCHPOINTS: TouchpointRecord[] = parseCSVToTouchpoints(RAW_CSV_GROUND_TRUTH);

export const FLOODLIGHT_CONFIG_META = {
  configId: 'FLC_8849201_CM360_P2C',
  advertiserId: 'ADV_994012_GLOBAL',
  activityName: 'Floodlight Enhanced P2C Attribution',
  lookbackWindowDays: 90,
  clickWindowDays: 90,
  impressionWindowDays: 90,
  countingMethod: 'Standard Transactions & Unique User Path Tracking',
};
