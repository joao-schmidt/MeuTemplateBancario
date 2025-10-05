// App.tsx
import React, { useState, useEffect } from 'react'; 
import {
  View, 
  Text,
  TextInput,
  Button, 
  Alert, 
  StyleSheet, 
  Switch, 
  ScrollView, 
} from 'react-native'; 
import { Picker } from '@react-native-picker/picker'; 
import Slider from '@react-native-community/slider'; 


const MIN_LIMIT = 500; 
const MAX_LIMIT = 10000; 
const INITIAL_LIMIT = 2500; 


export default function App() {
  const [nome, setNome] = useState<string>('');
  const [idade, setIdade] = useState<string>(''); 
  const [sexo, setSexo] = useState<string>(''); 
  const [limite, setLimite] = useState<number>(INITIAL_LIMIT); 
  const [estudante, setEstudante] = useState<boolean>(false); 
  const [errors, setErrors] = useState<Record<string, string>>({}); 
  const [formOk, setFormOk] = useState<boolean>(false); 
  const [resumo, setResumo] = useState<null | { nome: string; idade: number; sexo: string; limite: number; estudante: boolean }>(null); 

  
  const validateAll = () => {
    const erro: Record<string, string> = {}; 
    if (!nome || nome.trim() === '') {
      erro.nome = 'Nome é obrigatório.';
    }

    // valida idade: obrigatório, numérico e >= 18
    const idadeTrim = (idade || '').trim(); 
    if (idadeTrim === '') {
      erro.idade = 'Idade é obrigatória.'; 
    } else {
      const idadeNum = parseInt(idadeTrim, 10); 
      if (Number.isNaN(idadeNum)) {
        erro.idade = 'Idade deve ser numérica.'; 
      } else if (idadeNum < 18) {
        erro.idade = 'Idade mínima para abrir conta é 18 anos.'; 
      }
    }

    
    if (!sexo) {
      erro.sexo = 'Selecione o sexo.'; 
    }

    
    if (limite < MIN_LIMIT || limite > MAX_LIMIT) {
      erro.limite = `Limite deve estar entre ${MIN_LIMIT} e ${MAX_LIMIT}.`; 
    }

    
    if (typeof estudante !== 'boolean') {
      erro.estudante = 'Informe se é estudante.'; 
    }

    return erro; 
  };

  
  useEffect(() => {
    const e = validateAll(); 
    setErrors(e); 
    setFormOk(Object.keys(e).length === 0); 
  }, [nome, idade, sexo, limite, estudante]); 

  
  const handleAbrirConta = () => {
    const e = validateAll();
    setErrors(e); 
    if (Object.keys(e).length > 0) {
      
      const msgs = Object.values(e); 
      Alert.alert('Erros no formulário', msgs.join('\n')); 
      return; 
    }

    
    const idadeNum = parseInt(idade.trim(), 10); 
    const dados = {
      nome: nome.trim(),
      idade: idadeNum,
      sexo,
      limite,
      estudante,
    };

    setResumo(dados);
    
    Alert.alert(
      'Conta Aberta',
      `Nome: ${dados.nome}\nIdade: ${dados.idade}\nSexo: ${dados.sexo}\nLimite: R$ ${dados.limite.toFixed(2)}\nEstudante: ${dados.estudante ? 'Sim' : 'Não'}`
    );
  };


  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

 
  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Abertura de Conta</Text> 

     
      <Text style={styles.label}>Nome *</Text> 
      <TextInput
        style={[styles.input, errors.nome ? styles.inputError : null]} 
        placeholder="Digite seu nome"
        value={nome} 
        onChangeText={(t) => setNome(t)} 
        returnKeyType="done"
      />
      {errors.nome ? <Text style={styles.errorText}>{errors.nome}</Text> : null} 

      {/* Campo Idade */}
      <Text style={styles.label}>Idade *</Text> 
      <TextInput
        style={[styles.input, errors.idade ? styles.inputError : null]}
        placeholder="Digite sua idade (apenas números)"
        value={idade} 
        keyboardType="numeric" 
        onChangeText={(t) => setIdade(t.replace(/\D/g, ''))} 
        maxLength={3} 
      />
      {errors.idade ? <Text style={styles.errorText}>{errors.idade}</Text> : null} 

      {/* Campo Sexo (Picker) */}
      <Text style={styles.label}>Sexo *</Text> 
      <View style={[styles.pickerWrapper, errors.sexo ? styles.inputError : null]}> 
        <Picker
          selectedValue={sexo} 
          onValueChange={(itemValue) => setSexo(itemValue)} 
          mode="dropdown"
        >
          <Picker.Item label="-- Selecione --" value="" /> 
          <Picker.Item label="Masculino" value="Masculino" />
          <Picker.Item label="Feminino" value="Feminino" />
          <Picker.Item label="Outro" value="Outro" />
          
        </Picker>
      </View>
      {errors.sexo ? <Text style={styles.errorText}>{errors.sexo}</Text> : null} {/* mostra erro se houver */}

      {/* Slider Limite da Conta */}
      <Text style={styles.label}>Limite da conta: R$ {formatCurrency(limite)} *</Text> 
      <Slider
        style={{ width: '100%', height: 40 }} 
        minimumValue={MIN_LIMIT} 
        maximumValue={MAX_LIMIT} 
        step={50} 
        value={limite} 
        onValueChange={(v) => setLimite(v)} 
      />
      {errors.limite ? <Text style={styles.errorText}>{errors.limite}</Text> : null}

      
      <View style={styles.row}>
        <Text style={[styles.label, { marginRight: 10 }]}>Estudante? *</Text> 
        <Switch
          value={estudante} 
          onValueChange={(v) => setEstudante(v)}
        />
      </View>
      {errors.estudante ? <Text style={styles.errorText}>{errors.estudante}</Text> : null} 

      
      <View style={styles.buttonWrapper}>
        <Button title="Abrir Conta" onPress={handleAbrirConta} disabled={!formOk} /> 
      </View>

      
      {resumo ? (
        <View style={styles.resumoBox}>
          <Text style={styles.resumoTitle}>Resumo da Conta</Text>
          <Text>Nome: {resumo.nome}</Text>
          <Text>Idade: {resumo.idade}</Text>
          <Text>Sexo: {resumo.sexo}</Text>
          <Text>Limite: R$ {formatCurrency(resumo.limite)}</Text>
          <Text>Estudante: {resumo.estudante ? 'Sim' : 'Não'}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

// estilos da tela
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 40, 
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 12, 
    textAlign: 'center', 
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4, 
  },
  input: {
    borderWidth: 1,
    borderColor: '#999', 
    borderRadius: 6, 
    padding: 10, 
    fontSize: 16,
    backgroundColor: '#fff', 
  },
  inputError: {
    borderColor: '#cc0000', 
  },
  errorText: {
    color: '#cc0000', 
    marginTop: 4, 
  },
  pickerWrapper: {
    borderWidth: 1, 
    borderColor: '#999',
    borderRadius: 6, 
    overflow: 'hidden', 
  },
  row: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 12, 
  },
  buttonWrapper: {
    marginTop: 20, 
  },
  resumoBox: {
    marginTop: 24, 
    padding: 12, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    backgroundColor: '#fafafa', 
  },
  resumoTitle: {
    fontWeight: '700', 
    marginBottom: 8, 
  },
});
