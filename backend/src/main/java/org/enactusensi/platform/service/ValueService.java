package org.enactusensi.platform.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.enactusensi.platform.dto.content.AdminValueResponse;
import org.enactusensi.platform.dto.content.ValueDto;
import org.enactusensi.platform.dto.content.ValueRequest;
import org.enactusensi.platform.entity.Value;
import org.enactusensi.platform.exception.ResourceNotFoundException;
import org.enactusensi.platform.mapper.ContentMapper;
import org.enactusensi.platform.repository.ValueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ValueService {

    private final ValueRepository valueRepository;
    private final ContentMapper contentMapper;

    public ValueService(ValueRepository valueRepository, ContentMapper contentMapper) {
        this.valueRepository = valueRepository;
        this.contentMapper = contentMapper;
    }

    @Transactional(readOnly = true)
    public List<ValueDto> listActive() {
        return valueRepository.findAllByActiveTrueOrderByDisplayOrderAsc().stream()
                .map(contentMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdminValueResponse> listAll() {
        return valueRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(contentMapper::toAdminResponse)
                .toList();
    }

    @Transactional
    public AdminValueResponse create(ValueRequest request) {
        Value entity = contentMapper.toEntity(request);
        return contentMapper.toAdminResponse(valueRepository.save(entity));
    }

    @Transactional
    public AdminValueResponse update(Long id, ValueRequest request) {
        Value entity = findOrThrow(id);
        contentMapper.updateEntity(request, entity);
        return contentMapper.toAdminResponse(valueRepository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!valueRepository.existsById(id)) {
            throw new ResourceNotFoundException("Value not found with id " + id);
        }
        valueRepository.deleteById(id);
    }

    @Transactional
    public void reorder(List<Long> orderedIds) {
        Map<Long, Value> byId = new HashMap<>();
        valueRepository.findAllById(orderedIds).forEach(v -> byId.put(v.getId(), v));

        int position = 0;
        for (Long id : orderedIds) {
            Value entity = byId.get(id);
            if (entity == null) {
                throw new ResourceNotFoundException("Value not found with id " + id);
            }
            entity.setDisplayOrder(position++);
        }
        valueRepository.saveAll(byId.values());
    }

    private Value findOrThrow(Long id) {
        return valueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Value not found with id " + id));
    }
}
