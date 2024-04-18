## **tymtLauncher User Guide**

tymt is a multi-chain game launcher and an environment for creating and publishing games. \n tymt is a gaming environment and platform, built using the Solar Core blockchain solutions, enabling a new world of game economy - empowering Developers and Publishers!

Welcome to the tymtLauncher application. Please review the following guidelines to ensure optimal performance and correct any issues you may encounter.

### Application Data Location
Your application data is stored in a system-specific path:
    • Windows: C:\Users\[Your_Username]\AppData\Roaming\tymtLauncher
    • Linux: /home/[Your_Username]/.local/share/tymtLauncher
    • MacOS: /Users/[Your_Username]/Library/Application Support/tymtLauncher

### Manual Data Removal
If you experience any unexpected behavior with tymtLauncher, we recommend manually removing the tymtLauncher application data directory as described above. This reset-operation often would be helpful to resolve common issues.

### Updating tymtLauncher
When updating tymtLauncher, data from the previous version may remain in your directory. You have the option to delete this data or keep it based on your preference.

### Running Games
Games installed and run through tymtLauncher may encounter issues due to OS privacy/security settings, particularly with applications from unidentified developers. 
We are definitely on the way to have our launcher app code-signed, you will be able to play around with it in the upcoming weeks.
For now, to resolve these issues, please adjust your security settings to allow or unlock these applications. 

If problems persist, contact our support team for assistance.

### System Requirements
To ensure smooth operation of tymtLauncher, your system should meet the following minimum specifications:
    • Operating System: Windows (64-bit), macOS (64-bit), Linux (64-bit)
    • RAM: 4GB or higher
    • Free Disk Space: 5GB or more
By adhering to these guidelines, you will enhance your experience with tymtLauncher and ensure it runs effectively on your machine. For further assistance or inquiries, please reach out to our support team.

## **Troubleshooting Game Launch Issues in tymtLauncher**
If you encounter errors when attempting to launch games through tymtLauncher, such as the "The game has been corrupted. Please remove and reinstall" notification, please follow the steps below to troubleshoot and resolve the issue.
Let’s assume that Red Eclipse is installed but fails to launch through tymtLauncher, 

1. Verify Installation Integrity

### Initial Check:
    • Navigate to your application data directory specific to your operating system:
        ◦ Windows: C:\Users\[Your_Username]\AppData\Roaming\tymtLauncher
        ◦ Linux: /home/[Your_Username]/.local/share/tymtLauncher
        ◦ MacOS: /Users/[Your_Username]/Library/Application Support/tymtLauncher
    • Within this directory, locate the tymtLauncher/[version_number]/games/redeclipse folder.
    • If this folder is missing, or if it's present but empty, the game has not been installed correctly.
    
### Solution:
    • Delete the entire redeclipse folder.
    • Reinstall the game to ensure it is set up correctly.
    
2. Adjust OS Security Settings
If Red Eclipse is installed but fails to launch through tymtLauncher, your OS security settings may be blocking it.

### Steps to Allow Unidentified Applications:
    • Windows: Search for 'Allow an app through Windows Firewall' and add Red Eclipse to the list of allowed apps.
    • MacOS: Go to 'System Preferences' > 'Security & Privacy'. Under the 'General' tab, click 'Open Anyway' next to the message about Red Eclipse being blocked.
    • Linux: Depending on the distribution, you may need to adjust the executable permission settings using the command chmod +x /path/to/game.

3. Manual Game Launch
If adjusting the security settings does not resolve the issue, try launching the game directly.

### Steps to Manually Launch the Game:
    • Navigate to the game's installation folder (tymtLauncher/[version_number]/games/redeclipse).
    • Double-click the game's executable file to run it manually.
    • If the game does not launch manually, it indicates that the game files may be corrupted.

### Reinstallation:
    • Manually delete the redeclipse folder from your games directory.
    • Reinstall the game to replace the corrupted files.

If Issues Persist
If the game launches manually but not through tymtLauncher, or if other errors arise, please reach out to our support team for further assistance. Be sure to provide detailed information about the issue to help us resolve it more efficiently.
By following these guidelines, you should be able to resolve any issues related to game launches in tymtLauncher effectively. 
For further support, do not hesitate to contact our technical support team.

Sincerely,
Solar Enterprises