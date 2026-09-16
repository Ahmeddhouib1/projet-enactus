package org.enactusensi.platform.service;

import java.util.List;
import org.enactusensi.platform.dto.document.DocumentDto;
import org.enactusensi.platform.dto.document.DocumentRequest;
import org.enactusensi.platform.entity.Document;
import org.enactusensi.platform.entity.DocumentScope;
import org.enactusensi.platform.entity.Project;
import org.enactusensi.platform.exception.BadRequestException;
import org.enactusensi.platform.exception.ResourceNotFoundException;
import org.enactusensi.platform.mapper.DocumentMapper;
import org.enactusensi.platform.repository.DocumentRepository;
import org.enactusensi.platform.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final ProjectRepository projectRepository;
    private final DocumentMapper documentMapper;

    public DocumentService(DocumentRepository documentRepository,
                            ProjectRepository projectRepository,
                            DocumentMapper documentMapper) {
        this.documentRepository = documentRepository;
        this.projectRepository = projectRepository;
        this.documentMapper = documentMapper;
    }

    @Transactional(readOnly = true)
    public List<DocumentDto> listByScope(DocumentScope scope) {
        return documentRepository.findByScopeOrderByCreatedAtDesc(scope).stream()
                .map(documentMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DocumentDto> listByProject(Long projectId) {
        return documentRepository.findByProjectIdOrderByCreatedAtDesc(projectId).stream()
                .map(documentMapper::toDto)
                .toList();
    }

    @Transactional
    public DocumentDto create(DocumentRequest request) {
        Document document = new Document();
        document.setTitle(request.title());
        document.setFileUrl(request.fileUrl());
        document.setDescription(request.description());
        applyScope(document, request);
        return documentMapper.toDto(documentRepository.save(document));
    }

    @Transactional
    public DocumentDto update(Long id, DocumentRequest request) {
        Document document = findOrThrow(id);
        document.setTitle(request.title());
        document.setFileUrl(request.fileUrl());
        document.setDescription(request.description());
        applyScope(document, request);
        return documentMapper.toDto(documentRepository.save(document));
    }

    @Transactional
    public void delete(Long id) {
        if (!documentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Document not found with id " + id);
        }
        documentRepository.deleteById(id);
    }

    private void applyScope(Document document, DocumentRequest request) {
        document.setScope(request.scope());
        if (request.scope() == DocumentScope.PROJECT) {
            if (request.projectId() == null) {
                throw new BadRequestException("projectId is required when scope is PROJECT");
            }
            Project project = projectRepository.findById(request.projectId())
                    .orElseThrow(() -> new BadRequestException("projectId does not reference an existing project"));
            document.setProject(project);
            document.setPhase(request.phase());
        } else {
            document.setProject(null);
            document.setPhase(null);
        }
    }

    private Document findOrThrow(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id " + id));
    }
}
