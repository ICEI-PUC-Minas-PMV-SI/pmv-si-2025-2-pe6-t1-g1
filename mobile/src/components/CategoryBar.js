import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export default function CategoryBar({ categories = [], selectedCategory, onSelect }) {
  if (!categories || categories.length === 0) return null;
  return (
    <View style={{ width: '100%', marginTop: 12 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryPill, selectedCategory === cat ? styles.categoryPillActive : null]}
            onPress={() => onSelect && onSelect(cat)}
            activeOpacity={0.8}
          >
            <Text style={[styles.categoryText, selectedCategory === cat ? styles.categoryTextActive : null]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesContainer: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  categoryPill: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  categoryPillActive: {
    backgroundColor: '#EB3738',
    borderColor: '#EB3738',
  },
  categoryText: {
    color: '#444',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
});
