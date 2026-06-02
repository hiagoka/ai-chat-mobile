import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
  StyleSheet,
} from "react-native";
import { useRef, useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ONBOARDING_KEY } from "../config";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    icon: "auto-awesome" as const,
    accent: "#4F8CFF",
    title: "Bem-vindo ao\nAI Chat",
    subtitle: "Seu assistente pessoal com\ninteligência artificial avançada.",
  },
  {
    icon: "bolt" as const,
    accent: "#8B5CF6",
    title: "Respostas em\nTempo Real",
    subtitle: "Veja a IA responder token por\ntoken, como mágica.",
  },
  {
    icon: "bookmark" as const,
    accent: "#10B981",
    title: "Histórico\nSempre Salvo",
    subtitle: "Todas as suas conversas ficam\nsalvas direto no dispositivo.",
  },
];

type SlideProps = {
  item: (typeof SLIDES)[0];
  isVisible: boolean;
};

function OnboardingSlide({ item, isVisible }: SlideProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
      ]).start();
    } else {
      opacity.setValue(0);
      translateY.setValue(30);
      scale.setValue(0.8);
    }
  }, [isVisible]);

  return (
    <View style={[slideStyles.container, { width }]}>
      <View style={[slideStyles.circle1, { backgroundColor: item.accent + "18" }]} />
      <View style={[slideStyles.circle2, { backgroundColor: item.accent + "0C" }]} />

      <Animated.View style={{ alignItems: "center", opacity, transform: [{ translateY }, { scale }] }}>
        <View style={[slideStyles.iconRing, { borderColor: item.accent + "40" }]}>
          <View style={[slideStyles.iconInner, { backgroundColor: item.accent + "25" }]}>
            <View style={[slideStyles.iconCore, { backgroundColor: item.accent }]}>
              <MaterialIcons name={item.icon} size={36} color="#fff" />
            </View>
          </View>
        </View>

        <Text style={slideStyles.title}>{item.title}</Text>
        <Text style={slideStyles.subtitle}>{item.subtitle}</Text>
      </Animated.View>
    </View>
  );
}

const slideStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  circle1: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    top: "15%",
    alignSelf: "center",
  },
  circle2: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: 250,
    top: "5%",
    alignSelf: "center",
  },
  iconRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 44,
  },
  iconInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCore: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#F1F5F9",
    textAlign: "center",
    lineHeight: 42,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 24,
  },
});

type Props = {
  onDone: () => void;
};

export default function OnboardingScreen({ onDone }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      setCurrentIndex((i) => i + 1);
    } else {
      AsyncStorage.setItem(ONBOARDING_KEY, "true").then(onDone);
    }
  };

  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <View style={[outerStyles.container, { backgroundColor: "#0A0F1E" }]}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item, index }) => (
          <OnboardingSlide item={item} isVisible={index === currentIndex} />
        )}
      />

      <View style={outerStyles.footer}>
        <View style={outerStyles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                outerStyles.dot,
                i === currentIndex ? outerStyles.dotActive : outerStyles.dotInactive,
                i === currentIndex && { backgroundColor: SLIDES[currentIndex].accent },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[outerStyles.button, { backgroundColor: SLIDES[currentIndex].accent }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={outerStyles.buttonText}>{isLast ? "Começar" : "Próximo"}</Text>
          <MaterialIcons name={isLast ? "rocket-launch" : "arrow-forward"} size={20} color="#fff" />
        </TouchableOpacity>

        {!isLast && (
          <TouchableOpacity
            onPress={() => AsyncStorage.setItem(ONBOARDING_KEY, "true").then(onDone)}
          >
            <Text style={outerStyles.skip}>Pular</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const outerStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 52,
    alignItems: "center",
    gap: 16,
  },
  dots: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 24,
  },
  dotInactive: {
    width: 6,
    backgroundColor: "#334155",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  skip: {
    color: "#475569",
    fontSize: 14,
  },
});
