# Calendars
voOot hosts a selection of feeds readily available for syndication. All feeds require an API key or authorization header to access the info, and are available in either RSS, Google, Outlook, or iCal calendar formats.

For some types of applications, consuming raw syndicated feeds is the simplest path to voOot integration.

## Organization Calendar Feeds
You can get a feed of the upcoming events for a group in iCal format with

    https://api.vooot.com/organization/{{organization_id}}/upcoming.ical?key=YOUR_API_KEY

Replacing organization_id with the id of the target organization.

You can also subscribe to a voOot organization's event and rsvp feeds from the Organization's homepage under the Calendar tab.

## Member Calendar Feeds
You can get a feed of your member-specific feed of voOot events you are attending. To get this link, just login to api.vooot.nl and click on the "Export to..." link below the calendar on the voOot homepage.

## Activity Calendar Feeds
A feed of site activity is also available as a general API in Atom, RSS, and other standard API formats. More documentation on this feed can be found here.


## References
webcal://www.meetup.com/events/ical/46045772/bbb52d93e61ae0e6100219a8b7fc9cdaddf625c4/going

http://sabre.io
https://github.com/smallpath/node-caldav-server
https://github.com/LordEidi/fennel
