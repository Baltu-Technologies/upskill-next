import ApiService from './api.service';

const SlidesService = {
  // Get all slides
  getAllSlides: async () => {
    return await ApiService.get('/slides');
  },

  getTestData: async () => {
    return await ApiService.get('/sfwd-courses');
  },

  // Get a specific slide by ID
  getSlideById: async (id) => {
    return await ApiService.get(`/slides/${id}`);
  },

  // Create a new slide
  createSlide: async (slideData) => {
    return await ApiService.post('/slides', slideData);
  },

  // Update a slide
  updateSlide: async (id, slideData) => {
    return await ApiService.put(`/slides/${id}`, slideData);
  },

  // Delete a slide
  deleteSlide: async (id) => {
    return await ApiService.delete(`/slides/${id}`);
  }
};

export default SlidesService; 