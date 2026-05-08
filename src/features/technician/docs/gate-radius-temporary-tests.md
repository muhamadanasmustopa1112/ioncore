# Gate Radius Temporary: Test Scenarios

Dokumen ini berisi daftar skenario pengujian (Test Cases) untuk fitur **H. Dispatch & Gate Radius Temporary**, yang mencakup aturan terkait *provisioning* Radius sementara pada saat teknisi melakukan *dispatch* (pengambilan barang/perangkat dari gudang) hingga tahap *NOC approval*.

## Test Cases

| ID | Skenario | Priority | Dependency/Rule | Expected State | Trigger/Action | Validation/Result | Catatan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HT-H01** | Dispatch sukses memicu Radius temporary tepat satu kali | P1 | Network §5.3 Radius Generation; Billing §7.1 | WO Inventory Reserved. | 1. Warehouse scan device + tech ID; WO -> Dispatched.<br>2. Periksa Radius store. | Tepat satu kredensial Radius terbuat dalam state `TEMPORARY`, ter-link ke `wo_id`, expiry = product window. | Hanya satu baris; matematika expiry benar. |
| **HT-H02** | Pembuatan Radius idempotent pada event dispatch berulang | P1 | Network §5.3 idempotency | WO sudah Dispatched; Radius temp sudah ada. | Replay event dispatch.<br>1. Republish event dispatch ke bus.<br>2. Periksa Radius store. | Tetap satu kredensial Radius; replay ter-log tapi tidak ada duplikat. | Count(radius_creds where wo_id=X) == 1; baris audit replay ada. |
| **HT-H03** | Dispatch tanpa reservation inventori ditolak | P1 | Aturan gate (README) — kedua syarat true | WO tanpa baris reservation | 1. Force event dispatch.<br>2. Periksa WO + Radius. | Dispatch ditolak, tidak ada kredensial Radius. | WO bukan di Dispatched; tidak ada baris Radius. |
| **HT-H04** | Reserved tapi belum dispatched: pembuatan Radius ditolak | P1 | Aturan gate | WO reserved, belum dispatched. | 1. Trigger pembuatan Radius langsung.<br>2. Periksa. | Provisioning ditolak; tidak ada kredensial. | API mengembalikan 4xx dengan "gate not satisfied". |
| **HT-H05** | Outage Radius service: state temp_pending, retry queued | P2 | Gate + recovery | Server RADIUS mengembalikan 5xx | 1. Dispatch WO dengan RADIUS down.<br>2. Periksa baris Radius + queue retry.<br>3. Hidupkan kembali RADIUS, tunggu retry. | Baris terbuat dengan state `temporary_pending`, retry job berjalan, saat sukses -> `TEMPORARY` | Tidak ada false success; transisi ke TEMPORARY tercatat. |
| **HT-H06** | WO dibatalkan setelah temp create -> Radius revoked | P1 | Gate + cancellation | Radius temp aktif. | 1. Cancel WO.<br>2. Periksa baris Radius + audit.<br>3. Coba autentikasi dengan kredensial lama. | State baris Radius `REVOKED`; attempt auth ditolak; audit lengkap. | Tidak bisa autentikasi; baris audit ada. |
| **HT-H07** | WO reschedule sebelum instalasi: device dikembalikan, port ditahan, Radius revoked | P2 | Tech §7.1 Customer Reschedule | WO Dispatched. | 1. Customer reschedule.<br>2. Periksa device, port, Radius. | Device -> Available (returned); port reservation tetap (dalam TTL); Radius temp di-revoke; tanggal baru diset. | Tiga substate benar; alasan reschedule ter-log. |
| **HT-H08** | Expiry Radius temporary tanpa NOC approval -> state expired + alert | P2 | Billing §8.2 + Network §5.2 | Test product window = 1 jam.<br>WO Dispatched, tanpa BAST dalam 1 jam. | 1. Tunggu lewat window.<br>2. Periksa Radius + alert. | Baris Radius -> `EXPIRED`; alert ke NOC + Sales; WO di-flag follow-up. | Transisi otomatis, alert dipancarkan. |

---
*Catatan: Dokumen ini disimpan di modul NOC/Technician sebagai referensi standar implementasi state gating dan idempotent events untuk layanan provisioning Radius secara temporary selama teknisi di lapangan.*
