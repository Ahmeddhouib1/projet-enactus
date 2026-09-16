package org.enactusensi.platform.util;

import java.text.Normalizer;
import java.util.function.Predicate;
import java.util.regex.Pattern;

public final class SlugUtil {

    private static final Pattern NON_ALPHANUMERIC = Pattern.compile("[^a-z0-9]+");
    private static final Pattern EDGE_HYPHENS = Pattern.compile("^-+|-+$");

    private SlugUtil() {
    }

    public static String slugify(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase();
        String slug = NON_ALPHANUMERIC.matcher(normalized).replaceAll("-");
        slug = EDGE_HYPHENS.matcher(slug).replaceAll("");
        return slug.isBlank() ? "item" : slug;
    }

    /**
     * Generates a unique slug from the given name, appending -2, -3, ... if
     * the base slug is already taken according to {@code isTaken}.
     */
    public static String uniqueSlug(String name, Predicate<String> isTaken) {
        String base = slugify(name);
        String candidate = base;
        int suffix = 2;
        while (isTaken.test(candidate)) {
            candidate = base + "-" + suffix++;
        }
        return candidate;
    }
}
