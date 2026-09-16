package org.enactusensi.platform.dto.member;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import org.enactusensi.platform.entity.MemberDepartment;

public record MemberRequest(
        @NotBlank(message = "fullName is required") String fullName,
        @NotBlank(message = "email is required") @Email(message = "email must be valid") String email,
        String phone,
        String photoUrl,
        /** Nullable: not every role belongs to Marketing or Sponsoring. */
        MemberDepartment department,
        /** Free-text job title (e.g. "Project Manager") - optional, used to filter the Project Space's picker. */
        String role,
        boolean active,
        List<Long> projectIds
) {
}
