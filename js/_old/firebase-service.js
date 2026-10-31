import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    addDoc, 
    updateDoc, 
    doc, 
    onSnapshot,
    query,
    orderBy,
    arrayUnion
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const FirebaseService = {
    /**
     * Fetch all pets from the 'pets' collection, ordered by registration date
     */
    async getPets() {
        const petsCol = collection(db, 'pets');
        const petSnapshot = await getDocs(petsCol);
        return petSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    },

    /**
     * Subscribe to real-time updates for pets
     */
    subscribeToPets(callback) {
        const q = query(collection(db, 'pets'));
        return onSnapshot(q, (snapshot) => {
            const pets = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(pets);
        });
    },

    /**
     * Add a new pet to Firestore
     */
    async addPet(petData) {
        try {
            const petsCol = collection(db, 'pets');
            const docRef = await addDoc(petsCol, {
                ...petData,
                createdAt: new Date().toISOString()
            });
            return docRef.id;
        } catch (e) {
            console.error("Error adding pet: ", e);
            throw e;
        }
    },

    /**
     * Add a vaccination record to a pet's 'vaccinations' array
     */
    async addVaccinationRecord(petId, record) {
        try {
            const petRef = doc(db, 'pets', petId);
            await updateDoc(petRef, {
                vaccinations: arrayUnion(record)
            });
        } catch (e) {
            console.error("Error adding vaccination record: ", e);
            throw e;
        }
    }
};
