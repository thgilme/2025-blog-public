# 🚀 OCI Ubuntu 实例：启动卷空间扩展指南

在 Oracle Cloud Infrastructure (OCI) 首次创建实例时，启动卷（Boot Volume）默认大小只有 47GB。如果后期需要更大的存储空间，我们必须手动扩展它。

本文将分享一个经过验证的、**适用于 Ubuntu 系统** 的启动卷扩展流程。

## 🔍 问题背景：为什么 OCI 官方工具不起作用？

在我最初尝试扩展启动卷时，曾参考了互联网上的教程，并尝试运行 `sudo /usr/libexec/oci-growfs` 命令。然而，系统提示：`command not found`。

经过研究和验证，我发现：

> **`oci-growfs`** 是 **OCI Utilities** 的一部分，它是针对 **Oracle Linux 7** 等特定发行版的扩展工具，**不适用于 Ubuntu**。

因此，我们需要使用标准的 Linux 分区工具来完成卷扩展。

## ✅ 适用于 Ubuntu 的启动卷扩展步骤

以下是在 Ubuntu 实例上安全扩展启动卷分区的完整流程：

### 阶段一：在 OCI 控制台操作

这是卷扩展的第一步，用于在云端将存储空间分配给启动卷。

1.  **访问实例中的启动卷菜单栏。** 找到实例，进入其关联的启动卷设置。
2.  **编辑并输入新的值。** 将启动卷大小修改为需要的更大值（例如，从 47GB 改为 100GB）。
    > ⚠️ **注意：** 新值**必须大于**引导卷的当前大小。
3.  **保存更改。** 保存后，系统将在云端完成卷大小的调整。
4.  保存更改后，控制台可能会出现一个提示框，其中包含下一步操作的命令。

### 阶段二：在实例 SSH 命令行操作

在云端卷大小调整完成后，我们需要在实例内部调整分区和文件系统，使其识别并使用新的空间。

1.  **通过 SSH 访问该实例。**

2.  **验证分区的当前大小。** 运行 `df -h` 命令，您会看到文件系统大小仍是旧值 (如 47G)，但底层磁盘已经变大。

    ```bash
    df -h
    ```
3. **执行阶段一第4步复制的扫描命令。**

4.  **扩展分区 (`growpart`)。** 运行以下命令，将分区 `/dev/sda1` 扩展到卷的全部新空间。

    ```bash
    sudo growpart /dev/sda 1
    ```

5.  **扩展文件系统 (`resize2fs`)。** 运行此命令，将分区上的 **ext4 文件系统** 扩展到分区的新边界。

    ```bash
    sudo resize2fs /dev/sda1
    ```

6.  **最终检查。** 再次运行 `df -h` 命令，检查您的根目录 (`/`) 文件系统大小是否已成功显示为新的启动卷大小。

    ```bash
    df -h
    ```

-----

## 🔗 参考文档

1.  [IOIOX 作者的文章](https://www.ioiox.com/archives/162.html/comment-page-2#comments)
2.  [甲骨文官方相关说明文档](https://blogs.oracle.com/oracle-brasil/como-estender-a-particao-de-volume-de-inicializacao-na-oracle-cloud)
