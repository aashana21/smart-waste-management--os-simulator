import { WasteCategory } from '../types.ts';

export interface WasteSample {
  category: WasteCategory;
  name: string;
  icon: string;
}

export const WASTE_SAMPLES: WasteSample[] = [
  { category: 'recyclable', name: 'Plastic Bottles', icon: '🧴' },
  { category: 'metal', name: 'Aluminum Cans', icon: '🥫' },
  { category: 'organic', name: 'Compost Bio-Waste', icon: '🥬' },
  { category: 'glass', name: 'Recycled Glass', icon: '🍾' },
  { category: 'electronic', name: 'E-Waste PCB', icon: '💻' },
  { category: 'recyclable', name: 'Paper & Cardboard', icon: '📦' },
];

export const CODE_SNIPPETS = {
  c: {
    producer: [
      { line: 1, text: 'void* producer(void* arg) {' },
      { line: 2, text: '  while(1) {' },
      { line: 3, text: '    item_t item = produce_item();' },
      { line: 4, text: '    sem_wait(&empty);         // Wait for buffer space', highlightKey: 'wait_empty' },
      { line: 5, text: '    pthread_mutex_lock(&mutex); // Enter Critical Section', highlightKey: 'wait_mutex' },
      { line: 6, text: '    buffer_insert(item);       // CRITICAL SECTION', highlightKey: 'cs_produce' },
      { line: 7, text: '    pthread_mutex_unlock(&mutex); // Exit Critical Section', highlightKey: 'signal_mutex' },
      { line: 8, text: '    sem_post(&full);          // Signal item ready', highlightKey: 'signal_full' },
      { line: 9, text: '  }' },
      { line: 10, text: '}' },
    ],
    consumer: [
      { line: 1, text: 'void* consumer(void* arg) {' },
      { line: 2, text: '  while(1) {' },
      { line: 3, text: '    sem_wait(&full);          // Wait for available item', highlightKey: 'wait_full' },
      { line: 4, text: '    pthread_mutex_lock(&mutex); // Enter Critical Section', highlightKey: 'wait_mutex' },
      { line: 5, text: '    item_t item = buffer_remove(); // CRITICAL SECTION', highlightKey: 'cs_consume' },
      { line: 6, text: '    pthread_mutex_unlock(&mutex); // Exit Critical Section', highlightKey: 'signal_mutex' },
      { line: 7, text: '    sem_post(&empty);         // Signal space freed', highlightKey: 'signal_empty' },
      { line: 8, text: '    process_item(item);' },
      { line: 9, text: '  }' },
      { line: 10, text: '}' },
    ],
  },
  python: {
    producer: [
      { line: 1, text: 'def producer():' },
      { line: 2, text: '    while True:' },
      { line: 3, text: '        item = produce_waste()' },
      { line: 4, text: '        empty_sem.acquire()      # Wait for empty slot', highlightKey: 'wait_empty' },
      { line: 5, text: '        with mutex_lock:         # Mutual exclusion', highlightKey: 'wait_mutex' },
      { line: 6, text: '            buffer.append(item)  # CRITICAL SECTION', highlightKey: 'cs_produce' },
      { line: 7, text: '        # Lock auto-released', highlightKey: 'signal_mutex' },
      { line: 8, text: '        full_sem.release()       # Signal full item', highlightKey: 'signal_full' },
    ],
    consumer: [
      { line: 1, text: 'def consumer():' },
      { line: 2, text: '    while True:' },
      { line: 3, text: '        full_sem.acquire()       # Wait for item in buffer', highlightKey: 'wait_full' },
      { line: 4, text: '        with mutex_lock:         # Mutual exclusion', highlightKey: 'wait_mutex' },
      { line: 5, text: '            item = buffer.pop()  # CRITICAL SECTION', highlightKey: 'cs_consume' },
      { line: 6, text: '        # Lock auto-released', highlightKey: 'signal_mutex' },
      { line: 7, text: '        empty_sem.release()      # Signal slot available', highlightKey: 'signal_empty' },
      { line: 8, text: '        recycle(item)' },
    ],
  },
  pseudo: {
    producer: [
      { line: 1, text: 'Producer Process:' },
      { line: 2, text: '  repeat' },
      { line: 3, text: '    produce next waste item;' },
      { line: 4, text: '    wait(empty);          // wait if slots == 0', highlightKey: 'wait_empty' },
      { line: 5, text: '    wait(mutex);          // acquire mutual exclusion', highlightKey: 'wait_mutex' },
      { line: 6, text: '    add item to buffer;   // [CRITICAL SECTION]', highlightKey: 'cs_produce' },
      { line: 7, text: '    signal(mutex);        // release lock', highlightKey: 'signal_mutex' },
      { line: 8, text: '    signal(full);         // increment full count', highlightKey: 'signal_full' },
      { line: 9, text: '  until false;' },
    ],
    consumer: [
      { line: 1, text: 'Consumer Process:' },
      { line: 2, text: '  repeat' },
      { line: 3, text: '    wait(full);           // wait if buffer is empty', highlightKey: 'wait_full' },
      { line: 4, text: '    wait(mutex);          // acquire mutual exclusion', highlightKey: 'wait_mutex' },
      { line: 5, text: '    remove item;          // [CRITICAL SECTION]', highlightKey: 'cs_consume' },
      { line: 6, text: '    signal(mutex);        // release lock', highlightKey: 'signal_mutex' },
      { line: 7, text: '    signal(empty);        // increment empty count', highlightKey: 'signal_empty' },
      { line: 8, text: '    recycle waste item;' },
      { line: 9, text: '  until false;' },
    ],
  },
};
