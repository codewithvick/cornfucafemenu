import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MenuItem, CategoryId } from '../types';
import { INITIAL_MENU_ITEMS } from '../data/mockMenu';

const PRODUCTS_COLLECTION = 'products';

/**
 * Maps a Firestore product document from the main online store
 * to the digital menu's MenuItem format.
 */
export function mapProductToMenuItem(docData: any): MenuItem {
  let category: CategoryId = 'food';
  const rawCat = (docData.categoryId || '').toLowerCase();

  if (rawCat === 'espresso') category = 'espresso';
  else if (rawCat === 'boba-tea' || rawCat === 'boba') category = 'boba';
  else if (rawCat === 'juices' || rawCat === 'juice') category = 'juice';
  else if (rawCat === 'matcha') category = 'matcha';
  else if (rawCat === 'smoothies' || rawCat === 'smoothie') category = 'smoothies';
  else if (rawCat === 'food') category = 'food';

  const matchedInitial = INITIAL_MENU_ITEMS.find(
    (m) =>
      m.id === docData.id ||
      m.name.toLowerCase().trim() === (docData.name || '').toLowerCase().trim()
  );

  const image = docData.image || matchedInitial?.image || '';
  const description = docData.description || docData.tagline || matchedInitial?.description || '';

  return {
    id: docData.id,
    name: docData.name || matchedInitial?.name || 'Untitled Item',
    category,
    price: Number(docData.price) || matchedInitial?.price || 0,
    price700ml: docData.secondaryPrice
      ? Number(docData.secondaryPrice)
      : matchedInitial?.price700ml,
    image,
    description,
    tags: docData.badge
      ? [docData.badge]
      : docData.sizeLabel
      ? [docData.sizeLabel]
      : matchedInitial?.tags || [],
    isAvailable: docData.inStock !== false,
    available: typeof docData.available === 'number' ? docData.available : 30,
    sold: typeof docData.sold === 'number' ? docData.sold : 0,
  };
}

/**
 * Maps a MenuItem back into a Firestore document for the `products` collection,
 * matching the schema of the main online store.
 */
export function mapMenuItemToProductDoc(item: MenuItem): Record<string, any> {
  let categoryId = item.category as string;
  if (item.category === 'boba') categoryId = 'boba-tea';
  if (item.category === 'juice') categoryId = 'juices';

  return {
    id: item.id,
    name: item.name,
    categoryId,
    price: Number(item.price) || 0,
    secondaryPrice: item.price700ml ? Number(item.price700ml) : null,
    image: item.image,
    description: item.description || '',
    inStock: item.isAvailable !== false,
    isDrink: item.category !== 'food',
    badge: item.tags?.[0] || null,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Saves or updates a single item directly in the shared `products` collection.
 * Uses { merge: true } to avoid overwriting extra fields used by the online store.
 */
export async function saveProductToCloud(item: MenuItem): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, item.id);
    const data = mapMenuItemToProductDoc(item);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error('Error saving product to Firestore cloud:', error);
    throw error;
  }
}

/**
 * Deletes a product from the shared `products` collection.
 */
export async function deleteProductFromCloud(id: string): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting product from Firestore cloud:', error);
    throw error;
  }
}

/**
 * Real-time listener for the shared `products` collection.
 * Syncs menu updates across all devices (digital menu, admin, and online store).
 */
export function subscribeToProductsCloud(
  onUpdate: (items: MenuItem[]) => void,
  onError?: (err: Error) => void
): () => void {
  try {
    const q = query(collection(db, PRODUCTS_COLLECTION));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudItems: MenuItem[] = snapshot.docs.map((d) =>
            mapProductToMenuItem({ ...d.data(), id: d.id })
          );
          onUpdate(cloudItems);
        } else {
          // If Firestore is somehow empty, fallback to INITIAL_MENU_ITEMS
          onUpdate(INITIAL_MENU_ITEMS);
        }
      },
      (error) => {
        console.error('Firestore real-time products subscription error:', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (err: any) {
    console.error('Failed to setup Firestore listener:', err);
    if (onError) onError(err);
    return () => {};
  }
}
