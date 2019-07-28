README.txt


/*
Project: Mars/VetiPak Co-Packing Proof-of-Concept
WRITTEN BY: JAMES BAYLISS (CONTRACTOR)
TECHNOLOGIES: D3 (v4), JavaScript (ES5/6), JQuery (latest as at 2nd May 2019), Bootstrap (latest as at 2nd May 2019)
WRITTEN BETWEEN: April 2019 to May 2019

DESCRIPTION: proof of concept mutli-tab and interadctive UI interface to allow VetiPak Hold Initiators to trace and initiate hold calls for pallets needing to be withdraw and returned.
*/
    



TODOs/Bugs to fix
- dialogs on diamonds and squares are not cropped when leacing 'focus' charting space
- remove data object from global array (to be used later in "Summary Tab")
- improve CSS styling or light/dark rows on Bulk table using Classnames, not iterating loops
- summary graphs.
- need to improve summary graphs to transition to summarise number of pallets/cases by location



This project was writen in SublimeText 2
This project was developed and tested in FireFox. FireFox is the recommended browser to demo this product in as it possesses it's own internal server (D3 requires a server to run successfully)

This project has also been test opened in Chrome, using a Python localhost server and was found to work successfully. 
To acheive this, use these following steps:
1) download the content zip folder from DropBox (found at Dropbox -> Co-Packing POC -> poc_visual) to your chosen location.
2) unzip the content folder
3) open a terminal window and navigate the command line prompt to the chosen folder location
4) determine the version of python you have (v2 or v3)
5)
# If Python version returned above is 3.X enter the following on thge command line
python3 -m http.server

# On windows try "python" instead of "python3"

# If Python version returned above is 2.X
python -m SimpleHTTPServer  

Open Chrome and enter localhost:8000 in your web browser.

The co-packing visual should then oepn in Chrome.

