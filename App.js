import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Keyboard,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  // ✅ State 1: input text
  const [goalText, setGoalText] = useState("");

  // ✅ State 2: goals list
  const [goals, setGoals] = useState([]);

  // ✅ One function for button click
  const handleAddGoal = () => {
    const trimmed = goalText.trim();
    if (!trimmed) {
      Alert.alert("Empty goal", "Please write a goal first 🙂");
      return;
    }

    setGoals((prev) => [
      { id: Date.now().toString(), text: trimmed, done: false },
      ...prev,
    ]);
    setGoalText("");
    Keyboard.dismiss();
  };

  const toggleDone = (id) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g))
    );
  };

  const deleteGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const stats = useMemo(() => {
    const total = goals.length;
    const done = goals.filter((g) => g.done).length;
    return { total, done, left: total - done };
  }, [goals]);

  const renderItem = ({ item, index }) => (
    <View style={styles.itemWrap}>
      <Pressable
        onPress={() => toggleDone(item.id)}
        style={({ pressed }) => [
          styles.itemCard,
          item.done && styles.itemCardDone,
          pressed && { opacity: 0.9 },
        ]}
      >
        <View style={styles.itemLeft}>
          <View style={[styles.indexPill, item.done && styles.indexPillDone]}>
            <Text style={[styles.indexText, item.done && styles.indexTextDone]}>
              {index + 1}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.itemText, item.done && styles.itemTextDone]}>
              {item.text}
            </Text>
            <Text style={styles.itemHint}>
              Tap to {item.done ? "undo" : "mark as done"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => deleteGoal(item.id)}
          style={styles.deleteBtn}
          activeOpacity={0.85}
        >
          <Ionicons name="trash-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      {/* Background View (بديل الـ LinearGradient) */}
      <View style={styles.bg}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>My To-Do List</Text>
              <Text style={styles.subtitle}>
                Simple. Clean. Productive 🚀
              </Text>
            </View>

            <View style={styles.counterBox}>
              <Text style={styles.counterBig}>{stats.left}</Text>
              <Text style={styles.counterSmall}>left</Text>
            </View>
          </View>

          {/* Stats pills */}
          <View style={styles.pillsRow}>
            <View style={styles.pill}>
              <Ionicons name="list" size={14} color="#F6C945" />
              <Text style={styles.pillText}>Total: {stats.total}</Text>
            </View>

            <View style={styles.pill}>
              <Ionicons name="checkmark-circle" size={14} color="#7CFF8A" />
              <Text style={styles.pillText}>Done: {stats.done}</Text>
            </View>
          </View>
        </View>

        {/* Input */}
        <View style={styles.inputArea}>
          <View style={styles.inputWrap}>
            <Ionicons name="create-outline" size={18} color="#B8B8B8" />
            <TextInput
              value={goalText}
              onChangeText={setGoalText}
              placeholder="Type a new goal..."
              placeholderTextColor="#8C8C9A"
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={handleAddGoal}
            />
          </View>

          <TouchableOpacity
            onPress={handleAddGoal}
            style={styles.addBtn}
            activeOpacity={0.9}
          >
            <Ionicons name="add" size={22} color="#0B0B0F" />
          </TouchableOpacity>
        </View>

        {/* List */}
        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="sparkles" size={28} color="#F6C945" />
              <Text style={styles.emptyTitle}>No tasks yet</Text>
              <Text style={styles.emptyText}>
                Add your first goal and start building momentum ✨
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B0B0F" },
  bg: { flex: 1, paddingHorizontal: 16, paddingTop: 14 },

  header: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    elevation: 6,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 28, fontWeight: "800", color: "#FFFFFF" },
  subtitle: { marginTop: 4, fontSize: 13, color: "#C9C9D6" },

  counterBox: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: "rgba(246,201,69,0.15)",
    borderWidth: 1,
    borderColor: "rgba(246,201,69,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  counterBig: { fontSize: 22, fontWeight: "900", color: "#F6C945" },
  counterSmall: { fontSize: 12, color: "#F6C945" },

  pillsRow: { marginTop: 12, flexDirection: "row", gap: 10 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  pillText: { color: "#EDEDF5", fontSize: 12, fontWeight: "600" },

  inputArea: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "web" ? 14 : 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  input: { flex: 1, color: "#FFFFFF", fontSize: 14 },

  addBtn: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#F6C945",
    alignItems: "center",
    justifyContent: "center",
  },

  listContent: { paddingTop: 12, paddingBottom: 28 },

  itemWrap: { marginBottom: 10 },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  itemCardDone: {
    backgroundColor: "rgba(124,255,138,0.08)",
    borderColor: "rgba(124,255,138,0.25)",
  },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },

  indexPill: {
    width: 34,
    height: 34,
    borderRadius: 14,
    backgroundColor: "rgba(246,201,69,0.15)",
    borderWidth: 1,
    borderColor: "rgba(246,201,69,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  indexPillDone: {
    backgroundColor: "rgba(124,255,138,0.12)",
    borderColor: "rgba(124,255,138,0.35)",
  },
  indexText: { fontWeight: "900", color: "#F6C945", fontSize: 12 },
  indexTextDone: { color: "#7CFF8A" },

  itemText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  itemTextDone: { color: "#CFFFD6", textDecorationLine: "line-through" },
  itemHint: { marginTop: 2, color: "#A9A9B8", fontSize: 11 },

  deleteBtn: {
    backgroundColor: "#FF4D4D",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    marginLeft: 10,
  },

  emptyBox: {
    marginTop: 40,
    alignItems: "center",
    padding: 18,
  },
  emptyTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  emptyText: {
    marginTop: 6,
    color: "#B8B8B8",
    fontSize: 13,
    textAlign: "center",
  },
});
