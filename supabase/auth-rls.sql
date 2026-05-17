-- 既存のinsertポリシーを削除して認証必須に変更
drop policy if exists "Public galleries can be inserted" on galleries;
drop policy if exists "Public galleries can be updated" on galleries;
drop policy if exists "Public galleries can be deleted" on galleries;

-- 認証済みユーザーのみ登録・更新・削除できる
create policy "Authenticated users can insert galleries"
  on galleries for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update galleries"
  on galleries for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete galleries"
  on galleries for delete
  using (auth.role() = 'authenticated');

-- Storageも認証必須に
drop policy if exists "Public gallery images can be uploaded" on storage.objects;
create policy "Authenticated users can upload gallery images"
  on storage.objects for insert
  with check (bucket_id = 'gallery-images' and auth.role() = 'authenticated');
