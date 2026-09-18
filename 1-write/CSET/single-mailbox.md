Outlook Rate Limiting - TrackingID#2609140050003837
From: Anwar D <supportmail@techsupport.microsoft.com>
Sent: Monday, September 14, 2026 9:17 PM
To: Mast, Feitze <feitze.mast@tdsynnex.com>
Cc: Gherrel Pinkham <gherrel.pinkham@microsoft.com>; v-digerard@microsoft.com <v-digerard@microsoft.com>
Subject: Outlook Rate Limiting - TrackingID#2609140050003837
 


   This email originated outside of TD SYNNEX.  Please help keep our organization and partners safe. It's up to us; think before you click.

Hello,

 

Thank you for providing the details. The combined daily volume alone is not enough to confirm that a single mailbox would support this workload, particularly with the peaks you described.

 

The standard exchange online receiving limit is 3,600 messages per hour per mailbox. A burst of 700 messages in one minute does not by itself exceed that limit, but sustained or repeated bursts within the same hour could cause incoming messages from external senders to be rejected.

 

Microsoft graph separately allows 10,000 requests per 10-minute period and four concurrent requests for each application and mailbox combination. Requests to retrieve message content, move messages and send replies count toward this limit. Using a subscription does not remove these restrictions.

 

The standard sending limit is 10,000 recipients over a rolling 24-hour period, with a separate organization-wide limit for external recipients. If the projected 9,400 incoming messages each generate one reply to one recipient, there would be limited room for additional responses, copied recipients or growth.

 

We can clarify the documented service limits and troubleshoot specific failures within this case. Application redesign and capacity certification are outside the scope of technical support, and a permanent limit increase should not be assumed.

 

The applicable limits are documented here:

 

https://learn.microsoft.com/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits#receiving-and-sending-limits

 

https://learn.microsoft.com/graph/throttling-limits#outlook-service-limits

 

Could you provide the highest combined incoming message count within a 60-minute period across all 20 mailboxes and confirm how long the peak bursts usually last?

 

Please also confirm the expected number of replies per day, the average recipients per reply and how many graph requests the application makes to process each incoming message.

 

Are any delivery failures or throttling errors occurring today, or is this assessment solely for the planned consolidation?

 

Best regards,

Anwar Delgado Silva

Technical Support Engineer

Exchange Online

Working Hours: M-F 8:00am – 5:00pm CST

Need additional help? Feel free to contact my manager at:

Ricardo González Dueñas: ricardogo@microsoft.com

undefined

Mast, Feitze

supportmail <supportmail@techsupport.microsoft.com>;
Gilliam, Zak
Gherrel Pinkham;v-digerard@microsoft.com
Hi Zak,

On MS request I raised a ticket, see below.
Can you answer the questions from Anwar?

Regards,

 

 

Feitze Mast

M365 Platform Manager

 

cidimage001.png@01D8D403.A41A5850


M: (+34) 669 252 309

feitze.mast@tdsynnex.com

time zone: CET


I have sent this at a time that is convenient for me. It is not my expectation that you read, respond or follow up on this email outside your hours of work.