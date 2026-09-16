package org.enactusensi.platform.controller.public_api;

import java.util.List;
import org.enactusensi.platform.dto.partner.PartnerDto;
import org.enactusensi.platform.service.PartnerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/partners")
public class PublicPartnerController {

    private final PartnerService partnerService;

    public PublicPartnerController(PartnerService partnerService) {
        this.partnerService = partnerService;
    }

    @GetMapping
    public List<PartnerDto> listPartners() {
        return partnerService.listActive();
    }
}
