// Editorial stock photography from Pexels. Never presented as our team or clients.
export const blogImages: Record<string, { photographer: string; url: string; alt: { fr: string; en: string } }> = {
  "why-a-website": {"photographer":"Mizuno K","url":"https://www.pexels.com/photo/woman-working-with-laptop-in-cafe-13735905/","alt":{"fr":"Café, ordinateur et carnet de notes.","en":"Coffee, laptop and a notebook."}},
  "ai-built-websites": {"photographer":"Mike Murray","url":"https://www.pexels.com/photo/laptop-and-notebook-on-the-desk-6446245/","alt":{"fr":"Tablette, clavier et carnet sur un bureau.","en":"Tablet, keyboard and notebook on a desk."}},
  "multilingual-websites": {"photographer":"Berre Açıkdeniz","url":"https://www.pexels.com/photo/street-sign-with-arabic-and-english-text-28744462/","alt":{"fr":"Panneaux de rue en arabe et en anglais.","en":"Street signs in Arabic and English."}},
  "restaurant-website": {"photographer":"Matheus Bertelli","url":"https://www.pexels.com/photo/interior-of-a-restaurant-17294748/","alt":{"fr":"Tables dressées dans une salle de restaurant.","en":"Set tables in a restaurant dining room."}},
  "club-website": {"photographer":"Gonzalo Acuña","url":"https://www.pexels.com/photo/a-soccer-ball-on-the-grass-of-a-soccer-field-10923066/","alt":{"fr":"Ballon sur un terrain de football, joueurs en arrière-plan.","en":"Football on a grass pitch with players in the background."}},
};
export const blogImageSrc = (key: string, width = 1200) => `/blog/${key}-${width}.webp`;
export const blogImageSrcset = (key: string) => [480, 800, 1200].map(w => `${blogImageSrc(key, w)} ${w}w`).join(', ');
