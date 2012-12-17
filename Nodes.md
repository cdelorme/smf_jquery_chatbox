
Removed SSE due to lack of state management.
Revised ScrollEvent to work cross-browser.
Revised message rendering for administration
Added `user_color` field to `smf_chat` table, to store color codes for special group users.
Integrated SMF User-Name Colors.
Tested timestamp offsets.
Integrated colors from chat colors settings table.
Added custom permission to install xml script.
Added permission checks to install/uninstall PHP scripts.
Added delete message to API.
Integrated Permission check to API.
ChatBox XHR operations condensed into single URL using ChatAPI.
All DOM Components now Dynamically generated eliminating DOM dependencies.
Color editing introduced with jQuery Spectrum Plugin.
ChatAPI updated to have set/get/clear Color operations.
Cleaned up basic CSS.
Added id to all messages to identify message id for administrative operations.
Extended jQuery plugin prototype function inside admin script granting new functionality from within the admin script.
Adjusted CSS for administrative controls display formatting.
Implemented Administrative Ban and Delete operations.
Implemented limitation to only load ChatBox if no board/thread is being browsed.


---

**History:**

History page has been implemented.
No management occurs on the history page.

Add a link to History from ChatBox

Integrate a history.php page to paginate 100 messages at a time.

Basic pagination, aka older/newer no page numbers.

URL will use page= for pagination.

---

Integrate a chAdmin.php for ban management.  Should only load if the user has privileges.

---

**Admin Notes:**

Cross Browser testing then this part is completed!


---

Revise readme.txt and readme.md to reflect all of the changes to the ChatBox system.

Test the Package Installation Script.
Debug until it works.
Submit to SMF.

Carry Over a number of these changes to the original ChatBox source.

Begin SharedWorker Integration.
When SharedWorkers are complete, begin WebSocket testing.

---

**Major Problems:**

SSE has been removed from current and future plans due to stateless implementation.  It cannot track the delivered messages and creates additional overhead eliminating the aim of simplicity.

Administrative operations are not mobile device friendly using the hover operation...


---

**Notes:**

The core of SMF is the SSI.php file.  If imported, access to all operations is available.

To distribute permissions to groups for chat administration, must add custom permissions.

The XML install script thus modifies the languages files per theme?, each themes index.template.php file, the sources permissions file. and finally moves the chat folder to the top level.

The chat folder contains the new js, css, etc.  These are thus independent of the themes and should contain no special codes.

---

**References:**

[DB Functions](http://support.simplemachines.org/function_db/index.php?action=main)
[SMF Global Variables](http://wiki.simplemachines.org/smf/Global_variables)
[SMF UserInfo Variable](http://wiki.simplemachines.org/smf/$user_info)
