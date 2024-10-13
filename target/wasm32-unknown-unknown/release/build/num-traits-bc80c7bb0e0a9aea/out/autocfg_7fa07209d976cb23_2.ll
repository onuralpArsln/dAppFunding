; ModuleID = 'autocfg_7fa07209d976cb23_2.5a631c7362623c98-cgu.0'
source_filename = "autocfg_7fa07209d976cb23_2.5a631c7362623c98-cgu.0"
target datalayout = "e-m:e-p:32:32-p10:8:8-p20:8:8-i64:64-n32:64-S128-ni:1:10:20"
target triple = "wasm32-unknown-unknown"

; autocfg_7fa07209d976cb23_2::probe
; Function Attrs: nounwind
define dso_local void @_ZN26autocfg_7fa07209d976cb23_25probe17h3038719e00b8ce00E() unnamed_addr #0 {
start:
  %0 = alloca [4 x i8], align 4
  store i32 -2147483648, ptr %0, align 4
  %_0.i = load i32, ptr %0, align 4
  ret void
}

; Function Attrs: nocallback nofree nosync nounwind speculatable willreturn memory(none)
declare i32 @llvm.bitreverse.i32(i32) #1

attributes #0 = { nounwind "target-cpu"="generic" }
attributes #1 = { nocallback nofree nosync nounwind speculatable willreturn memory(none) }

!llvm.ident = !{!0}

!0 = !{!"rustc version 1.81.0 (eeb90cda1 2024-09-04)"}
