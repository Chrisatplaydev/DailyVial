# Galaxy identity and editable site history

Updated October 15, 2026.

## Visual identity

DailyVial now has a midnight-indigo background with violet and teal nebula gradients, subtle stationary stars, lavender accents, and a dark translucent navigation bar. Cards use a light lavender tint for readable content. The droplet mascot and familiar layout remain. The background is CSS, with no additional image download or animation. Previously unlocked Sunrise and Starlight palettes remain available as warmer or cooler cosmic variants.

## Remove or reset injection-site entries

Open **Peptides → Open map → Edit site history** to remove individual entries. Each removal has a review screen and is recoverable with Undo.

For a site entry linked to a dose, the review screen has an unchecked option to also remove that dose-log entry. By default the dose and amount remain in the dose log. Entries created before stable identifiers were added are linked only when product, exact timestamp, and area identify one unique matching dose.

**Reset history** removes all active site entries for the selected product from its map and rotation history. It preserves the peptide, approved areas, selected future area, and dose logs. Other products' site entries are unaffected. Undo restores the entries and immediately recalculates the map/rotation data.

Removed records are retained in the browser-local undo history. The most recent operation for the selected product can be undone; undoing it exposes the preceding operation. This is recoverable removal, not permanent erasure. Clearing the site's browser storage removes local records and undo history without a server backup.

`site-history.cjs` contains the immutable operations. Run `node site-history.test.cjs` to check scoped reset, optional linked-dose removal, preservation, recovery, and duplicate protection.

Browser checks used synthetic localhost entries. No hosted user injection history was removed during testing. Existing wallet, billing, ads, and AI-service limitations are unchanged; see [the prior release details](NEXT.md).
