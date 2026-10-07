import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/common/Icon';
import { IconTile } from '@/components/common/IconTile';
import { BackLink, PageHeader } from '@/components/common/PageHeader';
import { Screen, screenStyles } from '@/components/common/Screen';
import { SearchField } from '@/components/common/SearchField';
import { palette } from '@/constants/theme';

import { faqSections } from './faqContent';
import { styles } from './FaqScreen.styles';

export default function FaqScreen() {
  const [open, setOpen] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const query = search.trim().toLowerCase();

  const sections = faqSections
    .map((section) => ({ ...section, items: section.items.filter(([question, answer]) => !query || `${question} ${answer}`.toLowerCase().includes(query)) }))
    .filter((section) => section.items.length > 0);

  return (
    <Screen>
      <ScrollView contentContainerStyle={screenStyles.stackScroll} keyboardShouldPersistTaps="handled">
        <BackLink />
        <PageHeader title="Help Center" subtitle="Everything you need to know about renting with ARC." />
        <View style={styles.search}>
          <SearchField value={search} onChangeText={setSearch} placeholder="Search questions" />
        </View>
        {sections.length === 0 && <Text style={styles.empty}>No questions match “{search}”.</Text>}
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconTile name={section.icon} color={palette.blue} background={palette.blueSoft} size={32} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            {section.items.map(([question, answer]) => {
              const key = `${section.title}:${question}`;
              const expanded = open === key || !!query;
              return (
                <Pressable key={key} style={styles.item} onPress={() => setOpen(open === key ? null : key)} accessibilityRole="button" accessibilityState={{ expanded }}>
                  <View style={styles.row}>
                    <Text style={styles.question}>{question}</Text>
                    <Icon name={expanded ? 'minus' : 'plus'} size={18} color={palette.blue} />
                  </View>
                  {expanded && <Text style={styles.answer}>{answer}</Text>}
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
