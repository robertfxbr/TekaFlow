// Ajudante do TekaFlow para o reconhecimento de voz do Mac.
// "status" diz como está a permissão; "pedir" mostra o pedido do sistema e diz a resposta.
import Foundation
import Speech
import AVFoundation
import CoreGraphics

func texto(_ s: SFSpeechRecognizerAuthorizationStatus) -> String {
  switch s {
  case .authorized: return "liberada"
  case .notDetermined: return "pendente"
  default: return "negada"
  }
}

// Uma linha de JSON na saída padrão, e fim.
func responder(_ obj: [String: Any]) -> Never {
  if let d = try? JSONSerialization.data(withJSONObject: obj, options: []),
     let s = String(data: d, encoding: .utf8) {
    print(s)
  } else {
    print("{\"ok\":false,\"erro\":\"Falha ao montar a resposta.\"}")
  }
  fflush(stdout)
  exit(0)
}
func falhar(_ msg: String) -> Never { responder(["ok": false, "erro": msg]) }

// Grava o microfone padrão por `segundos` e transcreve em pt-BR.
func transcrever(_ segundos: Double) -> Never {
  // 1) Permissão de reconhecimento de voz (pede se ainda pendente).
  var fala = SFSpeechRecognizer.authorizationStatus()
  if fala == .notDetermined {
    let sem = DispatchSemaphore(value: 0)
    SFSpeechRecognizer.requestAuthorization { s in fala = s; sem.signal() }
    _ = sem.wait(timeout: .now() + 30)
  }
  if fala != .authorized { falhar("Sem permissão de reconhecimento de voz.") }

  // 2) Permissão de microfone.
  var mic = AVCaptureDevice.authorizationStatus(for: .audio)
  if mic == .notDetermined {
    let sem = DispatchSemaphore(value: 0)
    AVCaptureDevice.requestAccess(for: .audio) { _ in sem.signal() }
    _ = sem.wait(timeout: .now() + 30)
    mic = AVCaptureDevice.authorizationStatus(for: .audio)
  }
  if mic != .authorized { falhar("Sem permissão de microfone.") }

  // 3) Reconhecedor.
  guard let rec = SFSpeechRecognizer(locale: Locale(identifier: "pt_BR")), rec.isAvailable else {
    falhar("Reconhecimento de voz indisponível.")
  }
  let pedido = SFSpeechAudioBufferRecognitionRequest()
  pedido.shouldReportPartialResults = false
  if rec.supportsOnDeviceRecognition { pedido.requiresOnDeviceRecognition = true }

  // 4) Microfone.
  let motor = AVAudioEngine()
  let entrada = motor.inputNode
  let formato = entrada.outputFormat(forBus: 0)
  if formato.sampleRate == 0 || formato.channelCount == 0 { falhar("Nenhum microfone disponível.") }
  entrada.installTap(onBus: 0, bufferSize: 1024, format: formato) { buf, _ in
    pedido.append(buf)
  }
  motor.prepare()
  do { try motor.start() } catch { falhar("Não consegui abrir o microfone.") }

  var final = false
  var melhor = ""
  func fechar() {
    if final { return }
    final = true
    responder(["ok": true, "texto": melhor.trimmingCharacters(in: .whitespacesAndNewlines)])
  }

  let tarefa = rec.recognitionTask(with: pedido) { resultado, erro in
    if let r = resultado {
      melhor = r.bestTranscription.formattedString
      if r.isFinal { fechar() }
    }
    if erro != nil { fechar() } // erro após áudio: devolve o que houver (vazio = nada entendido)
  }
  _ = tarefa

  // Fim da gravação em N segundos; depois espera no máximo ~2 s pelo resultado final.
  DispatchQueue.main.asyncAfter(deadline: .now() + segundos) {
    motor.stop()
    entrada.removeTap(onBus: 0)
    pedido.endAudio()
    DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) { fechar() }
  }
  RunLoop.main.run()
  exit(0)
}

let comando = CommandLine.arguments.dropFirst().first ?? "status"
if comando == "arquivo" {
  // Reconhece a fala de um arquivo de áudio que o app gravou (a gravação é feita pelo próprio app, que já tem a permissão do microfone).
  let caminho = CommandLine.arguments.dropFirst(2).first ?? ""
  guard let rec = SFSpeechRecognizer(locale: Locale(identifier: "pt_BR")), rec.isAvailable else {
    print("{\"ok\":false,\"erro\":\"O reconhecimento de voz em português não está disponível neste Mac.\"}"); exit(0)
  }
  if SFSpeechRecognizer.authorizationStatus() != .authorized {
    print("{\"ok\":false,\"erro\":\"O TekaFlow não tem permissão de reconhecimento de voz.\"}"); exit(0)
  }
  let req = SFSpeechURLRecognitionRequest(url: URL(fileURLWithPath: caminho))
  req.shouldReportPartialResults = false
  rec.recognitionTask(with: req) { r, e in
    if let r = r, r.isFinal {
      let t = r.bestTranscription.formattedString.replacingOccurrences(of: "\\", with: "\\\\").replacingOccurrences(of: "\"", with: "\\\"")
      print("{\"ok\":true,\"texto\":\"\(t)\"}"); exit(0)
    } else if let e = e {
      let m = (e as NSError).localizedDescription.replacingOccurrences(of: "\"", with: "'")
      // "No speech detected" não é falha: só não havia fala no áudio.
      if m.lowercased().contains("no speech") { print("{\"ok\":true,\"texto\":\"\"}") } else { print("{\"ok\":false,\"erro\":\"\(m)\"}") }
      exit(0)
    }
  }
  RunLoop.main.run(until: Date().addingTimeInterval(30))
  print("{\"ok\":false,\"erro\":\"O reconhecimento demorou demais.\"}")
} else if comando == "transcrever" {
  let args = CommandLine.arguments
  guard args.count > 2, let n = Double(args[2]), n > 0 else { falhar("Informe os segundos: transcrever <segundos>.") }
  transcrever(n)
} else if comando == "tela" {
  // Pede a gravação de tela de verdade: é o que faz o app entrar na lista dos Ajustes.
  _ = CGRequestScreenCaptureAccess()
  print(CGPreflightScreenCaptureAccess() ? "liberada" : "pendente")
} else if comando == "pedir" {
  SFSpeechRecognizer.requestAuthorization { s in
    print(texto(s)); exit(0)
  }
  RunLoop.main.run()
} else {
  print(texto(SFSpeechRecognizer.authorizationStatus()))
}
