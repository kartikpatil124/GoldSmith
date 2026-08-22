// Local persistent store helper for Goldsmiths Inquiries
const LOCAL_STORAGE_KEY = 'goldsmiths_user_inquiries';

export const getLocalInquiries = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading local inquiries', err);
    return [];
  }
};

export const saveLocalInquiry = (inquiry) => {
  try {
    const current = getLocalInquiries();
    const newInquiry = {
      _id: inquiry._id || `INQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      inquiryId: inquiry.inquiryId || `INQ-${Date.now().toString().slice(-6)}`,
      customerName: inquiry.customerName || inquiry.name || 'Valued Client',
      email: inquiry.email || '',
      phone: inquiry.phone || '',
      productName: inquiry.productName || 'Fine Jewellery Consultation',
      productId: inquiry.productId || null,
      productSku: inquiry.productSku || '',
      inquiryType: inquiry.inquiryType || 'VIP Consultation Request',
      preferredContactMethod: inquiry.preferredContactMethod || inquiry.preferredChannel || 'WhatsApp',
      budgetRange: inquiry.budgetRange || inquiry.budget || 'Custom Quote',
      message: inquiry.message || inquiry.customizationNotes || 'Consultation request submitted.',
      status: inquiry.status || 'new',
      createdAt: inquiry.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      adminResponse: inquiry.adminResponse || null
    };
    // Deduplicate by productName and message if submitted recently
    const isDuplicate = current.some(i => i.productName === newInquiry.productName && i.message === newInquiry.message && (Date.now() - new Date(i.createdAt).getTime() < 3000));
    if (isDuplicate) return current[0];

    const updated = [newInquiry, ...current];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newInquiry;
  } catch (err) {
    console.error('Error saving local inquiry', err);
    return inquiry;
  }
};

export const updateLocalInquiry = (id, updateFields) => {
  try {
    const current = getLocalInquiries();
    const updated = current.map(item => {
      if (item._id === id || item.inquiryId === id) {
        return {
          ...item,
          ...updateFields,
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error updating local inquiry', err);
    return [];
  }
};

export const deleteLocalInquiry = (id) => {
  try {
    const current = getLocalInquiries();
    const updated = current.filter(item => item._id !== id && item.inquiryId !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error deleting local inquiry', err);
    return [];
  }
};
