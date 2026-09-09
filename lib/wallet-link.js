/** The exact text a wallet signs to link itself to a Core. Shared by the nonce and link routes. */
export const linkMessage = (nonce, site) =>
  `FyreCore wallet link\n\nSigning this links this wallet to your FyreCore Core. It costs nothing and sends no transaction.\n\nSite: ${site}\nNonce: ${nonce}`;
