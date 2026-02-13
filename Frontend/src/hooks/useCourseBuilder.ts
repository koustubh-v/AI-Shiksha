import { useState, useCallback, useEffect } from 'react';
import { Sections, SectionItems, LectureContent, Quizzes, Assignments } from '@/lib/api';
import type { CourseSection, SectionItem, CreateSectionDTO, CreateSectionItemDTO } from '@/types/courseBuilder';
import { toast } from 'sonner';

export function useCourseBuilder(courseId: string) {
    const [sections, setSections] = useState<CourseSection[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Fetch all sections for the course
    const fetchSections = useCallback(async () => {
        if (!courseId) return;

        setLoading(true);
        try {
            const data = await Sections.getByCourse(courseId);
            setSections(data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to load sections');
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    // Initialize on mount
    useEffect(() => {
        fetchSections();
    }, [fetchSections]);

    // ========== SECTION OPERATIONS ==========

    const createSection = useCallback(async (title: string, description?: string) => {
        setSaving(true);
        try {
            const newSection = await Sections.create(courseId, {
                title,
                description,
                order_index: sections.length,
            });
            setSections([...sections, newSection]);
            toast.success('Section created successfully');
            return newSection;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create section');
            throw error;
        } finally {
            setSaving(false);
        }
    }, [courseId, sections]);

    const updateSection = useCallback(async (sectionId: string, updates: { title?: string; description?: string; is_collapsed?: boolean }) => {
        setSaving(true);
        try {
            const updatedSection = await Sections.update(sectionId, updates);
            setSections(sections.map(s => s.id === sectionId ? updatedSection : s));
            toast.success('Section updated');
            return updatedSection;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update section');
            throw error;
        } finally {
            setSaving(false);
        }
    }, [sections]);

    const deleteSection = useCallback(async (sectionId: string) => {
        setSaving(true);
        try {
            await Sections.delete(sectionId);
            setSections(sections.filter(s => s.id !== sectionId));
            toast.success('Section deleted');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete section');
            throw error;
        } finally {
            setSaving(false);
        }
    }, [sections]);

    const reorderSections = useCallback(async (reorderedSections: CourseSection[]) => {
        const updates = reorderedSections.map((section, index) => ({
            id: section.id,
            order_index: index,
        }));

        try {
            await Sections.reorder(courseId, updates);
            setSections(reorderedSections);
            toast.success('Sections reordered');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reorder sections');
            throw error;
        }
    }, [courseId]);

    // ========== SECTION ITEM OPERATIONS ==========

    const createItem = useCallback(async (sectionId: string, itemData: CreateSectionItemDTO) => {
        setSaving(true);
        try {
            const section = sections.find(s => s.id === sectionId);
            if (!section) throw new Error('Section not found');

            const newItem = await SectionItems.create(sectionId, {
                ...itemData,
                order_index: section.items?.length || 0,
            });

            setSections(sections.map(s =>
                s.id === sectionId
                    ? { ...s, items: [...(s.items || []), newItem] }
                    : s
            ));

            toast.success(`${itemData.type.charAt(0) + itemData.type.slice(1).toLowerCase()} created successfully`);
            return newItem;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create item');
            throw error;
        } finally {
            setSaving(false);
        }
    }, [sections]);

    const updateItem = useCallback(async (itemId: string, updates: Partial<SectionItem>) => {
        setSaving(true);
        try {
            const updatedItem = await SectionItems.update(itemId, updates);

            setSections(sections.map(section => ({
                ...section,
                items: section.items?.map(item =>
                    item.id === itemId ? { ...item, ...updatedItem } : item
                ),
            })));

            toast.success('Item updated');
            return updatedItem;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update item');
            throw error;
        } finally {
            setSaving(false);
        }
    }, [sections]);

    const deleteItem = useCallback(async (sectionId: string, itemId: string) => {
        setSaving(true);
        try {
            await SectionItems.delete(itemId);

            setSections(sections.map(s =>
                s.id === sectionId
                    ? { ...s, items: s.items?.filter(i => i.id !== itemId) }
                    : s
            ));

            toast.success('Item deleted');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete item');
            throw error;
        } finally {
            setSaving(false);
        }
    }, [sections]);

    const reorderItems = useCallback(async (sectionId: string, reorderedItems: SectionItem[]) => {
        const updates = reorderedItems.map((item, index) => ({
            id: item.id,
            order_index: index,
        }));

        try {
            await SectionItems.reorder(updates);

            setSections(sections.map(s =>
                s.id === sectionId
                    ? { ...s, items: reorderedItems }
                    : s
            ));

            toast.success('Items reordered');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reorder items');
            throw error;
        }
    }, [sections]);

    // ========== LECTURE CONTENT ==========

    const saveLectureContent = useCallback(async (itemId: string, contentData: any) => {
        setSaving(true);
        try {
            // Try to get existing content first
            let content;
            try {
                await LectureContent.get(itemId);
                // If exists, update
                content = await LectureContent.update(itemId, contentData);
            } catch {
                // If doesn't exist, create
                content = await LectureContent.create(itemId, contentData);
            }

            toast.success('Lecture content saved');
            return content;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save lecture content');
            throw error;
        } finally {
            setSaving(false);
        }
    }, []);

    // ========== QUIZ OPERATIONS ==========

    const createQuiz = useCallback(async (itemId: string, quizData: any) => {
        setSaving(true);
        try {
            const quiz = await Quizzes.create(itemId, quizData);
            toast.success('Quiz created');
            return quiz;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create quiz');
            throw error;
        } finally {
            setSaving(false);
        }
    }, []);

    const addQuizQuestion = useCallback(async (quizId: string, questionData: any) => {
        setSaving(true);
        try {
            const question = await Quizzes.addQuestion(quizId, questionData);
            toast.success('Question added');
            return question;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add question');
            throw error;
        } finally {
            setSaving(false);
        }
    }, []);

    // ========== ASSIGNMENT OPERATIONS ==========

    const createAssignment = useCallback(async (itemId: string, assignmentData: any) => {
        setSaving(true);
        try {
            const assignment = await Assignments.create(itemId, assignmentData);
            toast.success('Assignment created');
            return assignment;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create assignment');
            throw error;
        } finally {
            setSaving(false);
        }
    }, []);

    return {
        // State
        sections,
        loading,
        saving,

        // Actions
        refresh: fetchSections,

        // Section operations
        createSection,
        updateSection,
        deleteSection,
        reorderSections,

        // Item operations
        createItem,
        updateItem,
        deleteItem,
        reorderItems,

        // Content operations
        saveLectureContent,
        createQuiz,
        addQuizQuestion,
        createAssignment,
    };
}
