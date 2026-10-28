# GitHub SSH: new account

Use a separate key and SSH host alias so this repository uses the new account
without changing the default account on this machine. Replace all-uppercase
placeholders.

1. Create and load a dedicated key:

   ```bash
   ssh-keygen -t ed25519 -C "t89147x@tdsynnex.com" -f ~/.ssh/id_ed25519_TDSYNNEX
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519_TDSYNNEX
   ```

2. Add `~/.ssh/id_ed25519_NEW_ACCOUNT.pub` in GitHub: **Settings → SSH and
   GPG keys → New SSH key**. A key already attached to another GitHub account
   cannot be reused.

3. Add this to `~/.ssh/config`:

   ```sshconfig
   Host github-new-account
     HostName github.com
     User git
     IdentityFile ~/.ssh/id_ed25519_NEW_ACCOUNT
     IdentitiesOnly yes
   ```

4. In this repository, switch the remote and commit identity:

   ```bash
   git remote set-url origin git@github-new-account:NEW_ACCOUNT/notes.git
   git config user.name "NEW_ACCOUNT_NAME"
   git config user.email "NEW_ACCOUNT_EMAIL"
   ```

5. Verify the account and remote:

   ```bash
   ssh -T git@github-new-account
   git fetch origin
   ```

References: [GitHub: multiple accounts](https://docs.github.com/en/account-and-profile/how-tos/account-management/managing-multiple-accounts) and [adding an SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).
