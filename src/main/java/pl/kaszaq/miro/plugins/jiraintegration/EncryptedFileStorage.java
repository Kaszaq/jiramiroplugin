/*
 * Copyright 2017 Michal Kasza.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package pl.kaszaq.miro.plugins.jiraintegration;

import org.jasypt.util.text.BasicTextEncryptor;
import pl.kaszaq.howfastyouaregoing.storage.DefaultFileStorage;
import pl.kaszaq.howfastyouaregoing.storage.FileStorage;

import java.io.File;
import java.io.IOException;

public class EncryptedFileStorage implements FileStorage {

    DefaultFileStorage defaultFileStorage = new DefaultFileStorage();
    private final BasicTextEncryptor textEncryptor;

    public EncryptedFileStorage(String password) {
        textEncryptor = new BasicTextEncryptor();
        textEncryptor.setPassword(password);
    }

    @Override
    public String loadFile(File fileName) throws IOException {
        return textEncryptor.decrypt(defaultFileStorage.loadFile(fileName));
    }

    @Override
    public void storeFile(File fileName, String data) throws IOException {
        defaultFileStorage.storeFile(fileName, textEncryptor.encrypt(data));
    }

}
