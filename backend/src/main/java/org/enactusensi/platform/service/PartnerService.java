package org.enactusensi.platform.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.enactusensi.platform.dto.partner.AdminPartnerResponse;
import org.enactusensi.platform.dto.partner.PartnerDto;
import org.enactusensi.platform.dto.partner.PartnerRequest;
import org.enactusensi.platform.entity.Partner;
import org.enactusensi.platform.exception.ResourceNotFoundException;
import org.enactusensi.platform.mapper.PartnerMapper;
import org.enactusensi.platform.repository.PartnerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PartnerService {

    private final PartnerRepository partnerRepository;
    private final PartnerMapper partnerMapper;

    public PartnerService(PartnerRepository partnerRepository, PartnerMapper partnerMapper) {
        this.partnerRepository = partnerRepository;
        this.partnerMapper = partnerMapper;
    }

    @Transactional(readOnly = true)
    public List<PartnerDto> listActive() {
        return partnerRepository.findAllByActiveTrueOrderByDisplayOrderAsc().stream()
                .map(partnerMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdminPartnerResponse> listAll() {
        return partnerRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(partnerMapper::toAdminResponse)
                .toList();
    }

    @Transactional
    public AdminPartnerResponse create(PartnerRequest request) {
        Partner entity = partnerMapper.toEntity(request);
        return partnerMapper.toAdminResponse(partnerRepository.save(entity));
    }

    @Transactional
    public AdminPartnerResponse update(Long id, PartnerRequest request) {
        Partner entity = findOrThrow(id);
        partnerMapper.updateEntity(request, entity);
        return partnerMapper.toAdminResponse(partnerRepository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!partnerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Partner not found with id " + id);
        }
        partnerRepository.deleteById(id);
    }

    @Transactional
    public void reorder(List<Long> orderedIds) {
        Map<Long, Partner> byId = new HashMap<>();
        partnerRepository.findAllById(orderedIds).forEach(p -> byId.put(p.getId(), p));

        int position = 0;
        for (Long id : orderedIds) {
            Partner entity = byId.get(id);
            if (entity == null) {
                throw new ResourceNotFoundException("Partner not found with id " + id);
            }
            entity.setDisplayOrder(position++);
        }
        partnerRepository.saveAll(byId.values());
    }

    private Partner findOrThrow(Long id) {
        return partnerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Partner not found with id " + id));
    }
}
