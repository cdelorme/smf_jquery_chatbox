
So, SSI.php is the core, import that and everything else is good.

Next step create icons for delete & ban.

Note all scripts, icons, and server scripts will be in the /chat folder, which will be moved to root during install.

Referencing that directory saves me from having to tinker with the absurd theme system.

I may or may not append CSS to themes from the script, I might import a css from the chat folder, again because of how gay that system is.


Once I get the files created and the server scripts updated to use SSI.php, I can begin testing the ChatBox integration on the site via manual code.

Once I get that working, and the delete operation etc, I can finish any changes I need to the install script.

I can remove the manual additions, and test the package manager installation.

Once finished I can move it, woot!~


---

Steps:

3. Test manually adding the CB code to the Back n Black theme

	- Ensure the location is identifiable in the default theme too
	- Identify the location & Update install script

4. Update Server Scripts & Begin testing New ChatBox

5. Get Admin Processes Working from chatBox.admin.js

6. Finalize the install process & test via Package manager

7. Upload changes to git repo

8. Integrate on HomePage for seaofnumbers.com

9. Submit to SMF Packages

---

Awesome, let the tailoring begin!

http://support.simplemachines.org/function_db/index.php?action=main
http://wiki.simplemachines.org/smf/Global_variables
http://wiki.simplemachines.org/smf/$user_info

---

I have to (heavily) modify the install.xml and possibly package-info.xml files.

I then want to test the install from the Package Manager!  If that works I will be thrilled!

Once I get the package manager to install the ChatBox system, I will be able to upload it to SMF.
